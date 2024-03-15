import express from "express";

import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import * as FileStore from 'session-file-store';
import teamsRoutes from './src/components/routing/teams';
import teamRoutes from './src/components/routing/team';
import playerRoutes from './src/components/routing/player';
import resetRoutes from './src/components/routing/reset';
import userSessionRoutes from './src/components/routing/user';
import teamCrestRoutes from './src/components/routing/crest';
import { paths, CLIENT_BASE_URL } from './src/components/routing/paths';
import { ensureLoggedIn } from './src/components/auth';
import use from "./src/components/interfaces/use";


const PORT = 3000;
const app = express();
const corsOptions = {
  origin: CLIENT_BASE_URL,
  credentials: true,
};
const fileStoreOptions = { path: path.join(__dirname, 'src', 'sessions'), ttl: 60 * 60 * 24 * 7, logFn: () => {} };
app.use(session({
  store: new (FileStore.default as any)(fileStoreOptions),
  secret: 'keyboard-cat',
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: 'none', secure: false },
}));
app.use(cors(corsOptions));
app.use(({req, res, next}: use) => {
  const allowedPaths = /^\/user(?!\/(login|status))(\/\w+)*/;
  if (allowedPaths.test(req.path)) {
    ensureLoggedIn({req, res, next});
  } else {
    next();
  }
});
app.use(bodyParser.json());

app.use(paths.teams, teamsRoutes);
app.use(paths.player, playerRoutes);
app.use(paths.team, teamRoutes);
app.use(paths.reset, resetRoutes);
app.use(paths.user, userSessionRoutes);
app.use(paths.crest, teamCrestRoutes);

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
