import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/main.css';
import { WEB_APP_PATHS } from './src/paths.js';
import Home from './src/components/Home/Home.jsx';
import TeamEditor from './src/components/TeamEditor/TeamEditor.jsx';
import TeamAdder from './src/components/TeamAdder/TeamAdder.jsx';
import TeamsList from './src/components/TeamsList/TeamsList.jsx';
import Error from './src/components/Error/Error.jsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path={WEB_APP_PATHS.home} element={<Home />} />
        <Route path={WEB_APP_PATHS.teams} element={<TeamsList />} />
        <Route path={WEB_APP_PATHS.team} element={<TeamEditor />} />
        <Route path={WEB_APP_PATHS.addTeam} element={<TeamAdder />} />
        <Route path={WEB_APP_PATHS.error} element={<Error />} />
      </Routes>
    </HashRouter>
  );
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);
