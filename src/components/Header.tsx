import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Header: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedName = localStorage.getItem("name");

    setUsername(storedUsername);
    setName(storedName);

    const handleStorageChange = () => {
      setUsername(localStorage.getItem("username"));
      setName(localStorage.getItem("name"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    setUsername(null);
    setName(null);
    navigate("/login");
  };

  return (
    <HeaderContainer>
      <h1>채용 과제</h1>
      <Nav>
        {username ? (
          <>
            <UserInfo>{name} ({username})</UserInfo>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </>
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
  margin-right: 15px;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
