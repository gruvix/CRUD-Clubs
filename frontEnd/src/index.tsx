import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/main.css';
import { webAppPaths } from './paths.js';
import Home from './components/Home/Home.jsx';
import TeamEditor from './components/TeamEditor/TeamEditor.jsx';
import TeamAdder from './components/TeamAdder/TeamAdder.jsx';
import TeamsList from './components/TeamsList/TeamsList.jsx';
import Error from './components/Error/Error.jsx';
import NotFound from './components/NotFound.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={webAppPaths.home} element={<Home />} />
        <Route path={webAppPaths.teams} element={<TeamsList />} />
        <Route path={webAppPaths.team} element={<TeamEditor />} />
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

