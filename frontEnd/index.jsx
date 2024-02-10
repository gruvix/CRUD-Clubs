import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/main.css';
import Home from './src/components/Home/Home.jsx';
import TeamEditor from './src/components/TeamEditor/TeamEditor.jsx';
import TeamAdder from './src/components/TeamAdder/TeamAdder.jsx';
import TeamsList from './src/components/TeamsList/TeamsList.jsx';
import Error from './src/components/Error/Error.jsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/teams" element={<TeamsList />} />
        <Route path="/user/team/:teamId" element={<TeamEditor />} />
        <Route path="/user/team/add" element={<TeamAdder />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </HashRouter>
  );
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);
