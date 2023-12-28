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

app.get('/', (req, res) => {
  res.render('home', {
    layout: 'main',
    data: {

    },
  });
});

app.get('/user/:username/teams', (req, res) => {
  const teams = JSON.parse(fs.readFileSync('./private/data/teams.json', 'utf-8'));
  res.render('teams', {
    layout: 'main',
    data: {
      username: req.params.username,
      capitalizedName: req.params.username.charAt(0).toUpperCase() + req.params.username.slice(1),
      teams,
    },
  });
});

function getTeamById(teamId) {
  return JSON.parse(fs.readFileSync(`./private/data/teams/${teamId}.json`, 'utf-8'));
}

app.get('/user/:username/teams/:team', (req, res) => {
  const team = getTeamById(req.params.team, req.params.username);
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

function updateTeam(team) {
  fs.writeFileSync(`./private/data/teams/${team.id}.json`, JSON.stringify(team));
}

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
    const team = getTeamById(req.params.teamId);
    Object.assign(team, updatedData);
    updateTeam(team);

    res.status(204).send();
  } catch (error) {
    res.status(400).send('Error updating team parameter');
  }
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
