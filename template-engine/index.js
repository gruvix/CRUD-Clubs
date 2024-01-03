const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const expresshandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const Team = require('./private/models/team.js');
const Player = require('./private/models/player.js');
const TeamListTeam = require('./private/models/teamListTeam.js');

const ensureLoggedIn = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    console.log('user not logged in, redirecting to homepage');
    res.redirect(301, '/');
  }
};

const PORT = 8000;
const app = express();
const handlebars = expresshandlebars.create();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard-cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

app.use('/user', ensureLoggedIn);
/**
 * gets a team by id and username
 * @param {string} userPath - path to user folder
 * @param {Number} teamId
 */
function getTeamByIdAndPath(userPath, teamId) {
  return JSON.parse(fs.readFileSync(`${userPath}/teams/${teamId}.json`, 'utf-8'));
}
/**
 * @param {string} username - username of the user
 * @returns the path to the root of the user E.g. ./private/data/user/default
 */
function generateUserPath(username) {
  return `./private/data/user/${username}`;
}
/**
 * @param {string} userPath - path to user folder
 * @param {Number} teamId
 * @param {string} parameter - teamlist parameter to be updated
 * @param {any} value - new value for parameter
 */
function updateTeamlistParameter(userPath, teamId, parameter, value) {
  const teams = JSON.parse(fs.readFileSync(`${userPath}/teams.json`, 'utf-8'));
  teams[teamId][parameter] = value;
  fs.writeFileSync(`${userPath}/teams.json`, JSON.stringify(teams));
}
function copyTeamFromTeamList(sourcePath, targetPath, teamId) {
  const userTeams = JSON.parse(fs.readFileSync(`${targetPath}/teams.json`, 'utf-8'));
  const defaultTeams = JSON.parse(fs.readFileSync(`${sourcePath}/teams.json`, 'utf-8'));
  const newTeam = Object.values(defaultTeams).find((team) => team.id === Number(teamId));
  try {
    userTeams[teamId] = new TeamListTeam(newTeam);
    fs.writeFileSync(`${targetPath}/teams.json`, JSON.stringify(userTeams));
  } catch (copyError) {
    throw new Error(copyError);
  }
}
function copyAllTeamsFromTeamList(userPath, defaultPath) {
  const teams = JSON.parse(fs.readFileSync(`${defaultPath}/teams.json`, 'utf-8'));
  const teamPrepared = {};
  teams.forEach((team) => {
    teamPrepared[team.id] = new TeamListTeam(team);
  });
  try {
    fs.writeFileSync(`${userPath}/teams.json`, JSON.stringify(teamPrepared));
  } catch (creationError) {
    throw new Error(creationError);
  }
}
function deleteTeamFromTeamlist(userPath, teamId) {
  const teams = JSON.parse(fs.readFileSync(`${userPath}/teams.json`, 'utf-8'));
  delete teams[teamId];
  fs.writeFileSync(`${userPath}/teams.json`, JSON.stringify(teams));
}
function validateFile(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    console.log(`File under path ${filePath} exists!`);
    return true;
  } catch (err) {
    console.log('File does not exist');
    return false;
  }
}
function validateUsername(username) {
  const regexLettersWithNoDefault = /^[^\W\d_](?!default$)[^\W\d_]*$/i;
  if (!regexLettersWithNoDefault.test(username)) {
    return false;
  }
  return true;
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
function createNewUser(userPath, defaultPath) {
  try {
    createFolder(userPath);
    createFolder(`${userPath}/teams`);
    copyAllTeamsFromTeamList(userPath, defaultPath);
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

app.get('/user/teams', (req, res) => {
  const { username } = req.session;
  const userPath = generateUserPath(username);
  const defaultPath = generateUserPath('default');
  if (!validateFile(`${userPath}/teams.json`)) {
    createNewUser(userPath, defaultPath);
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
app.get('/user/teams/:teamId', (req, res) => {
  const { teamId } = req.params;
  const { username } = req.session;
  let userPath = generateUserPath(username);
  if (isTeamDefault(userPath, teamId)) {
    userPath = generateUserPath('default');
  }
  const team = getTeamByIdAndPath(userPath, teamId);

  const players = [];
  team.squad.forEach((player) => {
    players.push(new Player(player));
  });

  res.render('teamEditor', {
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

function deleteFile(userPath) {
  fs.rmSync(userPath, { recursive: true, force: true });
}

app.patch('/user/reset/all', (req, res) => {
  const { username } = req.session;
  const userPath = generateUserPath(username);
  const defaultPath = generateUserPath('default');
  console.log(`Resetting user ${username}`);
  try {
    deleteFile(userPath);
    if (!validateFile(`${userPath}/teams.json`)) {
      createNewUser(userPath, defaultPath);
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).send('Error resetting teams');
  }
});

app.patch('/user/reset/:teamId', (req, res) => {
  const { username } = req.session;
  const { teamId } = req.params;
  const userPath = generateUserPath(username);
  const defaultPath = generateUserPath('default');
  console.log(`Resetting team ${teamId} from ${username}`);
  try {
    deleteFile(`${userPath}/teams/${teamId}.json`);
    copyTeam(defaultPath, userPath, teamId);
    copyTeamFromTeamList(defaultPath, userPath, teamId);

    res.status(204).send();
  } catch (error) {
    res.status(400).send(`Error resetting team ${teamId}`);
  }
});

app.patch('/user/teams/:teamId', (req, res) => {
  const { teamId } = req.params;
  const { username } = req.session;
  const userPath = generateUserPath(username);
  if (isTeamDefault(userPath, teamId)) {
    copyTeam(generateUserPath('default'), userPath, teamId);
    updateTeamlistParameter(userPath, teamId, 'isDefault', false);
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
    if (Object.keys(updatedData).includes('name')) {
      updateTeamlistParameter(userPath, teamId, 'name', updatedData.name);
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

app.delete('/user/teams/:teamId', (req, res) => {
  const { username } = req.session;
  const { teamId } = req.params;
  const userPath = generateUserPath(username);
  try {
    deleteFile(`${userPath}/teams/${teamId}.json`);
    deleteTeamFromTeamlist(userPath, teamId);
    res.status(204).send();
  } catch (error) {
    res.status(400).send('Error deleting team');
  }
});

app.post('/login/:username', (req, res) => {
  const { username } = req.params;
  req.session.username = username;
  console.log(`User '${username}' logged in`);
  res.redirect(301, '/user/teams');
});
app.get('/logout', (req, res) => {
  const { username } = req.session;
  req.session.destroy();
  console.log(`User '${username}' logged out`);
  res.redirect(301, '/user/teams');
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
