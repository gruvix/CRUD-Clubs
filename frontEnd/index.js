import React from "react";
import { createRoot } from "react-dom/client";
import BrowserRouter from "react-router-dom/BrowserRouter";

function App() {
    return (
    <BrowserRouter>
    {/* Routing here */}
    </BrowserRouter>
    )
}

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<App />)