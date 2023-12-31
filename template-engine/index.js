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

/**
 * gets a team by id and username
 * @param {Number} - Team id
 * @param {string} - Username
 */
function getTeamByIdAndUser(teamId, username) {
  return JSON.parse(fs.readFileSync(`./private/data/user/${username}/teams/${teamId}.json`, 'utf-8'));
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
function updateTeam(team, username) {
  fs.writeFileSync(`./private/data/user/${username}/teams/${team.id}.json`, JSON.stringify(team));
}

function createDefaultList(userPath) {
  const teams = JSON.parse(fs.readFileSync('./private/data/user/default/teams.json', 'utf-8'));
  const teamNames = {};
  teams.forEach((team) => {
    Object.assign(teamNames, {
      [team.id]: {
        name: team.name,
        id: team.id,
        isDefault: true,
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
  const userPath = `./private/data/user/${req.params.username}`;
  // check if user folder exists, if not, creates a copy from default folder
  if (!validateFile(`${userPath}/teams.json`)) {
    createNewUser(userPath);
  }
  const teams = JSON.parse(fs.readFileSync(`${userPath}/teams.json`, 'utf-8'));
  res.render('teams', {
    layout: 'main',
    data: {
      username: req.params.username,
      capitalizedName: req.params.username.charAt(0).toUpperCase() + req.params.username.slice(1),
      teams,
    },
  });
});
function isTeamDefault(userPath, teamId){
  const teams = JSON.parse(fs.readFileSync(`${userPath}/teams.json`, 'utf-8'));
  const team = teams[teamId];
  if (team.isDefault) {
    return true;
  }
  return false;
}
app.get('/user/:username/teams/:team', (req, res) => {
  const { username } = req.params;
  const team = getTeamByIdAndUser(req.params.team, username);
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

app.use(bodyParser.json());

app.patch('/user/:username/teams/:teamId', (req, res) => {
  try {
    let updatedData = req.body;
    if (Object.keys(updatedData).includes('area')) {
      updatedData = {
        area: {
          name: updatedData.area,
        },
      };
    }
    const team = getTeamByIdAndUser(req.params.teamId, req.params.username);
    Object.assign(team, updatedData);
    updateTeam(team, req.params.username);
    res.status(204).send();
  } catch (error) {
    res.status(400).send('Error updating team parameter');
  }
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
