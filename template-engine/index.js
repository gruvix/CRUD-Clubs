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

app.get('/user/:userName/teams', (req, res) => {
  res.render('teams', {
    layout: 'main',
    data: {
      userName: req.params.userName,
      capitalizedName: req.params.userName.charAt(0).toUpperCase() + req.params.userName.slice(1),
    },
  });
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
