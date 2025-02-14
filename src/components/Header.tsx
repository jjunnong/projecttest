import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Header: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedName = localStorage.getItem("name");

    setUsername(storedUsername);
    setName(storedName);

    const handleStorageChange = () => {
      setUsername(localStorage.getItem("username"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <HeaderContainer>
      <h1>채용 과제</h1>
      <Nav>
        {username ? (
          <UserInfo> {name} {username}</UserInfo>
        ) : (
          <AuthLinks>
            <StyledLink to="/signup">회원가입</StyledLink>
            <StyledLink to="/login">로그인</StyledLink>
          </AuthLinks>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const AuthLinks = styled.div`
  display: flex;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    text-decoration: underline;
  }
`;

const UserInfo = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #f0f0f0;
`;
