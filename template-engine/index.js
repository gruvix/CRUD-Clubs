const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const expresshandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const Team = require('./private/models/team.js');
const Player = require('./private/models/player.js');

const PORT = 8000;
const app = express();
const handlebars = expresshandlebars.create();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

/**
 * gets a team by id and username
 * @param {string} userPath - path to user folder
 * @param {Number} teamId
 */
function getTeamByIdAndPath(userPath, teamId) {
  return JSON.parse(fs.readFileSync(`${userPath}/teams/${teamId}.json`, 'utf-8'));
}
/**
 * @param {string} userName - username of the user
 * @returns the path to the root of the user E.g. ./private/data/user/default
 */
function generateUserPath(userName) {
  return `./private/data/user/${userName}`;
}
/**
 * @param {string} userPath - path to user folder
 * @param {Number} teamId
 */
function unDefaultTeam(userPath, teamId) {
  const teams = JSON.parse(fs.readFileSync(`${userPath}/teams.json`, 'utf-8'));
  teams[teamId].isDefault = false;
  fs.writeFileSync(`${userPath}/teams.json`, JSON.stringify(teams));
}
function validateFile(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    console.log('File exists!');
    return true;
  } catch (err) {
    console.log('File does not exist');
    return false;
  }
}
function createFolder(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, (createFolderError) => {
        if (createFolderError) {
          console.log(createFolderError);
        }
        console.log('User folder created');
      });
    }
  } catch (err) {
    throw new Error(err);
  }
}
/**
 * @param {string} sourcePath - source path of teams to be copied
 * @param {string} targetPath - target path to place copy
 * @param {Number} teamId - id of the team to be copied
 */
function copyTeam(sourcePath, targetPath, teamId) {
  try {
    fs.copyFileSync(`${sourcePath}/teams/${teamId}.json`, `${targetPath}/teams/${teamId}.json`);
  } catch (creationError) {
    throw new Error(creationError);
  }
}
function updateTeam(team, userPath) {
  fs.writeFileSync(`${userPath}/teams/${team.id}.json`, JSON.stringify(team));
}
function isTeamDefault(userPath, teamId) {
  const teams = JSON.parse(fs.readFileSync(`${userPath}/teams.json`, 'utf-8'));
  const team = teams[teamId];
  if (team.isDefault) {
    return true;
  }
  return false;
}
function createDefaultList(userPath) {
  const defaultPath = generateUserPath('default');
  const teams = JSON.parse(fs.readFileSync(`${defaultPath}/teams.json`, 'utf-8'));
  const teamNames = {};
  teams.forEach((team) => {
    Object.assign(teamNames, {
      [team.id]: {
        name: team.name,
        id: team.id,
        isDefault: true,
        lastUpdated: new Date().toISOString(),
      },
    });
  });
  try {
    fs.writeFileSync(`${userPath}/teams.json`, JSON.stringify(teamNames));
  } catch (creationError) {
    throw new Error(creationError);
  }
}

function createNewUser(userPath) {
  try {
    createFolder(userPath);
    createFolder(`${userPath}/teams`);
    createDefaultList(userPath);
  } catch {
    throw new Error('Failed to create new user');
  }
}
app.get('/', (req, res) => {
  res.render('home', {
    layout: 'main',
    data: {

    },
  });
});
app.get('/user/:username/teams', (req, res) => {
  const { username } = req.params;
  const userPath = generateUserPath(username);
  if (!validateFile(`${userPath}/teams.json`)) {
    createNewUser(userPath);
  }
  const teams = JSON.parse(fs.readFileSync(`${userPath}/teams.json`, 'utf-8'));
  res.render('teams', {
    layout: 'main',
    data: {
      username,
      capitalizedName: username.charAt(0).toUpperCase() + username.slice(1),
      teams,
    },
  });
});
app.get('/user/:username/teams/:teamId', (req, res) => {
  const { username, teamId } = req.params;
  let userPath = generateUserPath(username);
  if (isTeamDefault(userPath, teamId)) {
    userPath = generateUserPath('default');
  }
  const team = getTeamByIdAndPath(userPath, teamId);

  const players = [];
  team.squad.forEach((player) => {
    players.push(new Player(player));
  });

  res.render('team', {
    layout: 'main',
    data: {
      username,
      team: new Team(team),
      crest: team.crestUrl,
      id: team.id,
      players,
    },
  });
});

function deleteFolder(userPath) {
  fs.rmSync(userPath, { recursive: true, force: true });
}

app.patch('/user/:username/reset', (req, res) => {
  const { username } = req.params;
  const userPath = generateUserPath(username);
  console.log('reset');
  deleteFolder(userPath);
  if (!validateFile(`${userPath}/teams.json`)) {
    createNewUser(userPath);
  }
});

app.patch('/user/:username/teams/:teamId', (req, res) => {
  const { username, teamId } = req.params;
  const userPath = generateUserPath(username);
  if (isTeamDefault(userPath, teamId)) {
    copyTeam(generateUserPath('default'), userPath, teamId);
    unDefaultTeam(userPath, teamId);
  }
  try {
    let updatedData = req.body;
    if (Object.keys(updatedData).includes('area')) {
      updatedData = {
        area: {
          name: updatedData.area,
        },
      };
    }
    const team = getTeamByIdAndPath(userPath, teamId);
    const now = new Date();
    const lastUpdated = now.toISOString();
    updatedData.lastUpdated = lastUpdated;
    Object.assign(team, updatedData);
    updateTeam(team, userPath);
    res.status(204).send();
  } catch (error) {
    res.status(400).send('Error updating team parameter');
  }
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
