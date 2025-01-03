import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import pages
import HomePage from "./pages/HomePage";
import Past from "./pages/Past";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/past" element={<Past />} />
      </Routes>
    </Router>
  );
}

export default App;
