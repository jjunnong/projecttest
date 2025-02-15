import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup"
import Login from "./pages/login";
import Header from "./components/Header";
import CreateBoard from "./pages/createBoard"
import BoardList from "./pages/boardList";
import BoardDetail from "./pages/boardDetail"
import EditBoard from "./pages/editBoard";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<BoardList />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateBoard />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/edit/:id" element={<EditBoard />} />
      </Routes>
    </Router>
  );
};

export default App;
