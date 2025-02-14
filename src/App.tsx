import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h2>채용 과제</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
