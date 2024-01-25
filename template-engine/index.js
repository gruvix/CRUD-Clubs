const express = require('express');
const multer = require('multer');
const path = require('path');
const expresshandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const Team = require('./private/models/team.js');
const Player = require('./private/models/player.js');
const { createUser, deleteUser } = require('./private/src/user.js');
const { getDomain } = require('./private/src/domain.js');
const {
  getUserTeamsListJSONPath,
  getUserCustomCrestFolderPath,
} = require('./private/src/userPath.js');
const {
  validateFile,
} = require('./private/src/utils.js');
const {
  cloneTeamFromDefault,
  isTeamDefault,
  getTeam,
  getTeamsList,
  copyTeamListTeam,
  updateTeam,
  validateTeam,
  deleteTeam,
  addPlayersToTeam,
} = require('./private/src/teamStorage.js');
const { storage, imageFilter } = require('./private/src/multerConfig.js');
const { ensureLoggedIn, validateUsername } = require('./private/src/auth.js');

const uploadImage = multer({ storage, fileFilter: imageFilter });

const PORT = 8000;
const app = express();
const handlebars = expresshandlebars.create();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
const fileStoreOptions = { path: path.join(__dirname, 'private', 'sessions'), ttl: 60 * 60 * 24 * 7, logFn: () => {} };
app.use(session({
  store: new FileStore(fileStoreOptions),
  secret: 'keyboard-cat',
  resave: false,
  saveUninitialized: false,
}));
app.use('/user', ensureLoggedIn);
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const { username } = req.session;
  if (username) {
    console.log(`User '${username}' requested landing page, redirecting to teams view`);
    res.redirect(302, '/user/teams');
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
    console.log(`User not found, creating new user "${username}"`);
    createUser(username);
  }
  const teams = getTeamsList(username);
  const domain = getDomain(req);
  res.render('teams', {
    layout: 'main',
    data: {
      username,
      capitalizedName: username.charAt(0).toUpperCase() + username.slice(1),
      teams,
      domain,
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
    if (Array.isArray(team.squad)) {
      team.squad.forEach((player) => {
        players.push(new Player(player));
      });
    } else {
      players.push(new Player(team.squad));
    }

    const domain = getDomain(req);
    res.render('teamEditor', {
      layout: 'main',
      data: {
        username,
        team: new Team(team),
        crest: team.crestUrl,
        id: team.id,
        players,
        domain,
        hasCustomCrest: team.hasCustomCrest,
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
      console.log(error);
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

app.put('/user/teams/:teamId/player', (req, res) => {
  const { username } = req.session;
  const { teamId } = req.params;
  const { players } = req.body;
  Object.keys(players).forEach((player) => {
    console.log(`User ${username} added player ${players[player].name} to team ${teamId}`);
  });
  try {
    addPlayersToTeam(username, teamId, players);
    res.status(204).send();
  } catch {
    res.status(400).send('Error adding player to team');
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
    cloneTeamFromDefault(username, teamId);
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
  res.redirect(302, '/user/teams');
});
app.post('/logout', (req, res) => {
  const { username } = req.session;
  req.session.destroy();
  console.log(`User '${username}' logged out`);
  res.redirect(302, '/');
});

app.post('/user/:teamId/upload', uploadImage.single('image'), (req, res) => {
  const { username } = req.session;
  const { teamId } = req.params;
  const { filename } = req.file;
  console.log(`User '${username}' uploaded new crest for team ${teamId}`);
  console.log(req.file);
  const crestUrl = `/user/customCrest/${teamId}/${filename}`;
  const newData = {
    crestUrl,
    hasCustomCrest: true,
  };
  updateTeam(newData, username, teamId);
  res.status(200).send(crestUrl);
});

app.get('/user/customCrest/:teamId/:filename', (req, res) => {
  const { username } = req.session;
  const { teamId, filename } = req.params;
  const imgPath = `${getUserCustomCrestFolderPath(username, teamId)}/${filename}`;
  if (!validateFile(imgPath)) {
    res.status(404).send('Crest not found');
  } else {
    res.sendFile(imgPath, { root: '.' });
  }
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
