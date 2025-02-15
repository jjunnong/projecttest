import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup"
import Login from "./pages/login";
import Header from "./components/Header";
import CreateBoard from "./pages/createBoard"
import BoardDetail from "./pages/boardDetail"

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<h2>채용 과제</h2>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateBoard />} />
        <Route path="/board/:id" element={<BoardDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
