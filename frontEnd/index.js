import React from "react";
import { createRoot } from "react-dom/client";
import BrowserRouter from "react-router-dom/BrowserRouter";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/teams" element={<TeamsList />} />
            <Route path="/user/team/:teamId" element={<TeamEditor />} />
            <Route path="/user/team/add" element={<TeamAdder />} />
            <Route path="/error" element={<Error />} />
        </Routes>
    </BrowserRouter>
    )
}

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<App />)