const express = require('express');
const path = require('path');
const expresshandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const FileStore = require('session-file-store')(session);
const homeRoute = require('./private/src/routing/home.js');
const teamsRoutes = require('./private/src/routing/teams.js');
const teamRoutes = require('./private/src/routing/team.js');
const playerRoutes = require('./private/src/routing/player.js');
const resetRoutes = require('./private/src/routing/reset.js');
const userSessionRoutes = require('./private/src/routing/user.js');
const errorRoutes = require('./private/src/routing/error.js');
const teamCrestRoutes = require('./private/src/routing/crest.js');
const paths = require('./private/src/routing/paths.js');

const { ensureLoggedIn } = require('./private/src/auth.js');

const PORT = 8000;
const app = express();
const handlebars = expresshandlebars.create();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
const fileStoreOptions = { path: path.join(__dirname, 'private', 'sessions'), ttl: 60 * 60 * 24 * 7, logFn: () => {} };
app.use(session({
  store: new FileStore(fileStoreOptions),
  secret: 'keyboard-cat',
  resave: false,
  saveUninitialized: false,
}));
app.use((req, res, next) => {
  const allowedPaths = /^\/user(?!\/(login))(\/\w+)*/;
  if (allowedPaths.test(req.path)) {
    ensureLoggedIn(req, res, next);
  } else {
    next();
  }
});
app.use(bodyParser.json());

app.use(paths.home, homeRoute);
app.use(paths.teams, teamsRoutes);
app.use(paths.player, playerRoutes);
app.use(paths.team, teamRoutes);
app.use(paths.reset, resetRoutes);
app.use(paths.user, userSessionRoutes);
app.use(paths.crest, teamCrestRoutes);
app.use(paths.error, errorRoutes);

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
