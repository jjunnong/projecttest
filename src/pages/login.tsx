import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { Container, Input, Button, Message } from "../styles/styles";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("이메일과 비밀번호를 입력하세요");
      return;
    }

    try {
      const response = await login(username, password);

      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("username", username);

        const storedName = localStorage.getItem(`name-${username}`);
        if (storedName) {
          localStorage.setItem("name", storedName);
        }

        window.dispatchEvent(new Event("storage"));

        setMessage("로그인 성공");
        navigate("/");
      } else {
        setMessage("로그인 실패");
      }
    } catch (error) {
      setMessage("로그인 실패: 이메일 또는 비밀번호를 확인하세요");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Container>
      <h2>로그인</h2>
      <Input
        type="email"
        placeholder="이메일"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleLogin}>로그인</Button>
      {message && <Message>{message}</Message>}
    </Container>
  );
};

export default Login;
