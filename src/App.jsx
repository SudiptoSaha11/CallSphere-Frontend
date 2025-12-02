import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";

// Add other imports for your pages/components as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/room/:roomID" element={<Room />} />
        {/* Add more routes here, e.g. */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/chat" element={<ChatPanel />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
