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
function validateFolder(folderPath) {
  fs.access(folderPath, fs.constants.F_OK, (accessError) => {
    if (accessError) {
      return false;
    }
    return true;
  });
}
function createFolder(folderPath) {
  fs.mkdirSync(folderPath, (createFolderError) => {
    if (createFolderError) {
      console.log(createFolderError);
    }
    console.log('User folder created');
  });
}
function copyDefaultTeams(userPath, defaultPath) {
  const teams = JSON.parse(fs.readFileSync(`${defaultPath}/teams.json}`, 'utf-8'));
/**
 * @param {string} sourcePath - source path of teams to be copied
 * @param {string} targetPath - target path to place copy
 */
function copyTeams(sourcePath, targetPath) {
  const teams = JSON.parse(fs.readFileSync(`${sourcePath}/teams.json`, 'utf-8'));
  teams.forEach((team) => {
    try {
      fs.copyFileSync(`${sourcePath}/teams/${team.id}.json`, `${targetPath}/teams/${team.id}.json`);
    } catch (creationError) {
      throw new Error(creationError);
    }
  });
  try {
    fs.copyFileSync(`${sourcePath}/index.json`, `${targetPath}/index.json`);
  } catch (creationError) {
    throw new Error(creationError);
  }
}
function updateTeam(team, username) {
  fs.writeFileSync(`./private/data/user/${username}/teams/${team.id}.json`, JSON.stringify(team));
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
  if (!validateFolder(userPath)) { // TODO: check if index file exists INSTEAD of folder
    try {
      const defaultPath = './private/data/user/default';
      createFolder(userPath);
      createFolder(`${userPath}/teams`);
      copyDefaultTeams(userPath, defaultPath);
    } catch (err) {
      console.log(err);
      return;
    }
  }
  const teams = JSON.parse(fs.readFileSync(`${userPath}/index.json`, 'utf-8'));
  res.render('teams', {
    layout: 'main',
    data: {
      username: req.params.username,
      capitalizedName: req.params.username.charAt(0).toUpperCase() + req.params.username.slice(1),
      teams,
    },
  });
});
app.get('/user/:username/teams/:team', (req, res) => {
  const team = getTeamByIdAndUser(req.params.team, req.params.username);
  const players = [];
  team.squad.forEach((player) => {
    players.push(new Player(player));
  });

  res.render('team', {
    layout: 'main',
    data: {
      username: req.params.username,
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
