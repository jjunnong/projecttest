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
      <h1 onClick={() => navigate("/")}>채용 과제</h1>
      <Nav>
        {username ? (
          <UserSection>
            <UserInfo>{name} ({username})</UserInfo>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </UserSection>
        ) : (
          <AuthLinks>
            <StyledLink to="/signup">회원가입</StyledLink>
            <Separator>/</Separator>
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
  width: 100%;
  margin: 0 auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 5px 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: space-between;
    width: 100%;
    padding: 5px 10px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 5px;
  margin-right: 20px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 5px 10px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 5px;
  }
`;

const Separator = styled.span`
  color: white;
  font-size: 16px;
`;

const UserInfo = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #f0f0f0;
  margin-right: 15px;

  @media (max-width: 768px) {
    margin-left: 10px;
    font-size: 14px;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-right: 20px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;