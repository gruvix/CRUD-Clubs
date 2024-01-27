const express = require('express');
const path = require('path');
const expresshandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const homeRoute = require('./private/src/routing/home.js');
const teamsRoutes = require('./private/src/routing/teams.js');
const teamRoutes = require('./private/src/routing/team.js');
const playerRoutes = require('./private/src/routing/player.js');
const resetRoutes = require('./private/src/routing/reset.js');
const userSessionRoutes = require('./private/src/routing/user.js');
const errorRoutes = require('./private/src/routing/error.js');
const teamCrestRoutes = require('./private/src/routing/crest.js');

const { ensureLoggedIn } = require('./private/src/auth.js');

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

app.use('/', homeRoute);

app.use('/user/teams', teamsRoutes);
app.use('/user/teams', playerRoutes);
app.use('/user/teams', teamRoutes);
app.use('/user/reset', resetRoutes);
app.use('', userSessionRoutes);
app.use('/user/customCrest', teamCrestRoutes);
app.use('/error', errorRoutes);

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
