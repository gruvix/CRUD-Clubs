const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const expresshandlebars = require('express-handlebars');
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

app.get('/user/:username/teams/:team', (req, res) => {
  const team = JSON.parse(fs.readFileSync(`./private/data/teams/${req.params.team}.json`, 'utf-8'));
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

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
