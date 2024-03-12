import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/main.css';
import { webAppPaths } from './paths.js';
import Home from './components/Home/Home';
import TeamEditor from './components/TeamEditor/TeamEditor';
import TeamAdder from './components/TeamAdder/TeamAdder';
import TeamsList from './components/TeamsList/TeamsList';
import Error from './components/Error/Error';
import NotFound from './components/NotFound';
import UserChecker from './components/Home/UserChecker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={webAppPaths.home} element={<Home />} />
        <Route path={webAppPaths.user} element={<UserChecker />} />
        <Route path={webAppPaths.teams} element={<TeamsList />} />
        <Route path={webAppPaths.team(':teamId')} element={<TeamEditor />} />
        <Route path={webAppPaths.addTeam} element={<TeamAdder />} />
        <Route path={webAppPaths.error} element={<Error />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

