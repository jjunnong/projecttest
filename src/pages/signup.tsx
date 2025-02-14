import React, { useState } from "react";
import { signup } from "../api/auth";
import { Container, Input, Button, Message } from "../styles/styles";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!%*#?&@])[A-Za-z\d!%*#?&@]{8,}$/.test(password);
  };

  const handleSignup = async () => {
    if (!isValidEmail(username)) {
      setMessage("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (name.length < 2) {
      setMessage("이름은 최소 2자 이상이어야 합니다.");
      return;
    }

    if (!isValidPassword(password)) {
      setMessage("비밀번호는 8자 이상, 숫자, 영문자, 특수문자를 포함해야 합니다.");
      return;
    }

    try {
      await signup(username, name, password);
      setMessage("회원가입 성공!");
      localStorage.setItem(`name-${username}`, name);
    } catch (error) {
      setMessage("회원가입 실패");
    }
  };

  return (
    <Container>
      <h2>회원가입</h2>
      <Input type="email" placeholder="이메일" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleSignup}>가입하기</Button>
      {message && <Message>{message}</Message>}
    </Container>
  );
};  

export default Signup;
