import React, { useState } from "react";
import { signup } from "../api/api";
import { Container, Input, Button, Message } from "../styles/styles";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      await signup(username, name, password);
      setMessage("회원가입 성공!");
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
