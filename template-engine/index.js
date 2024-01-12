const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const expresshandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const Team = require('./private/models/team.js');
const Player = require('./private/models/player.js');
const {
  getUserRootPath,
  getUserTeamsListJSONPath,
  getUserCustomCrestFolderPath,
  getUserCustomCrestIMGPath,
  getUserTeamsFolderPath,
  getUserTeamJSONPath,
} = require('./private/src/path.js');
const {
  deleteFile,
  createFolder,
  validateFile,
} = require('./private/src/utils.js');
const {
  copyTeam,
  isTeamDefault,
  getTeam,
  getTeamsList,
  copyTeamListTeam,
  copyTeamList,
  updateTeam,
  deleteTeam,
  validateTeam,
} = require('./private/src/teamStorage.js');
const { storage, imageFilter } = require('./private/src/multerConfig.js');
const { ensureLoggedIn, validateUsername } = require('./private/src/auth.js');

const upload = multer({ storage, fileFilter: imageFilter });

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
}));

app.use('/user', ensureLoggedIn);
app.use(bodyParser.json());

function createUser(username) {
  try {
    createFolder(getUserRootPath(username));
    createFolder(getUserTeamsFolderPath(username));
    createFolder(getUserCustomCrestFolderPath(username));
    const defaultUsername = 'default';
    copyTeamList(defaultUsername, username);
  } catch {
    throw new Error('Failed to create new user');
  }
}
function deleteUser(username) {
  try {
    deleteFile(getUserRootPath(username));
  } catch {
    throw new Error('Failed to delete user');
  }
}
app.get('/', (req, res) => {
  const { username } = req.session;
  if (username) {
    console.log(`User '${username}' requested landing page, redirecting to teams view`);
    res.redirect(301, '/user/teams');
    return;
  }
  res.render('home', {
    layout: 'main',
    data: {

    },
  });
});

app.get('/user/teams', (req, res) => {
  const { username } = req.session;
  if (!validateFile(getUserTeamsListJSONPath(username))) {
    createUser(username);
  }
  const teams = getTeamsList(username);
  res.render('teams', {
    layout: 'main',
    data: {
      username,
      capitalizedName: username.charAt(0).toUpperCase() + username.slice(1),
      teams,
    },
  });
});

app.route('/user/teams/:teamId')
  .get((req, res) => {
    const { teamId } = req.params;
    const { username } = req.session;
    console.log(`User ${username} requested team ${teamId}`);
    if (!validateTeam(username, teamId)) {
      res.redirect('/error?keyword=Team-not-found&code=404');
      return;
    }
    let team;
    if (isTeamDefault(username, teamId)) {
      console.log(`Team ${teamId} from user '${username}' is default`);
      const defaultUsername = 'default';
      team = getTeam(defaultUsername, teamId);
    } else {
      team = getTeam(username, teamId);
    }

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
  })
  .patch((req, res) => {
    const { teamId } = req.params;
    const { username } = req.session;
    console.log(`User ${username} updated team ${teamId}`);

    try {
      const updatedData = req.body;
      updateTeam(updatedData, username, teamId);
      res.status(204).send();
    } catch (error) {
      res.status(400).send('Error updating team parameter');
    }
  })
  .delete((req, res) => {
    const { username } = req.session;
    const { teamId } = req.params;
    try {
      deleteTeam(username, teamId);
      res.status(204).send();
    } catch (error) {
      res.status(400).send('Error deleting team');
    }
  });

app.put('/user/reset/all', (req, res) => {
  const { username } = req.session;
  console.log(`Resetting user ${username}`);
  try {
    deleteUser(username);
    if (!validateFile(getUserTeamsListJSONPath(username))) {
      createUser(username);
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).send('Error resetting teams');
  }
});

app.put('/user/reset/:teamId', (req, res) => {
  const { username } = req.session;
  const { teamId } = req.params;
  console.log(`Resetting team ${teamId} from ${username}`);
  try {
    deleteTeam(username, teamId);
    const defaultUsername = 'default';
    copyTeam(defaultUsername, username, teamId);
    copyTeamListTeam(defaultUsername, username, teamId);

    res.status(204).send();
  } catch (error) {
    res.status(400).send(`Error resetting team ${teamId} from ${username}`);
  }
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  const error = validateUsername(username);
  if (error) {
    res.status(400).send(error);
    return;
  }
  req.session.username = username;
  console.log(`User '${username}' logged in`);
  res.redirect(301, '/user/teams');
});
app.post('/logout', (req, res) => {
  const { username } = req.session;
  req.session.destroy();
  console.log(`User '${username}' logged out`);
  res.redirect(301, '/');
});

app.get('/error', (req, res) => {
  let message = 'Bad Request';
  if (req.query.keyword) {
    message = req.query.keyword.replaceAll('-', ' ');
  }
  let code = 400;
  if (req.query.code) {
    code = req.query.code;
  }
  res.render('error', {
    layout: 'main',
    data: {
      message,
      code,
    },
  });
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
