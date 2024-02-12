import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/main.css';
import { webAppPaths } from './src/paths.js';
import Home from './src/components/Home/Home.jsx';
import TeamEditor from './src/components/TeamEditor/TeamEditor.jsx';
import TeamAdder from './src/components/TeamAdder/TeamAdder.jsx';
import TeamsList from './src/components/TeamsList/TeamsList.jsx';
import Error from './src/components/Error/Error.jsx';
import NotFound from './src/components/NotFound.jsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path={webAppPaths.home} element={<Home />} />
        <Route path={webAppPaths.teams} element={<TeamsList />} />
        <Route path={webAppPaths.team} element={<TeamEditor />} />
        <Route path={webAppPaths.addTeam} element={<TeamAdder />} />
        <Route path={webAppPaths.error} element={<Error />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
