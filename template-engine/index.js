const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');

const expresshandlebars = require('express-handlebars');

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

class Team {
  constructor(data) {
    this.name = data.name;
    this.area = data.area.name;
    this.adress = data.address;
    this.phone = data.phone;
    this.website = data.website;
    this.email = data.email;
    this.venue = data.venue;
  }
}

class Player {
  constructor(data) {
    this.name = data.name;
    this.position = data.position;
    this.dateOfBirth = data.dateOfBirth;
    this.countryOfBirth = data.countryOfBirth;
    this.nationality = data.nationality;
    this.shirtNumber = data.shirtNumber;
    this.role = data.role;
  }
}

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
      players,
    },
  });
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
