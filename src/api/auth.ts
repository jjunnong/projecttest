import axios from "axios";

const API_BASE_URL = "https://front-mission.bigs.or.kr/auth";

export const signup = async (username: string, name: string, password: string) => {
  return axios.post(`${API_BASE_URL}/signup`, {
    username,
    name,
    password,
    confirmPassword: password,
  });
};

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/signin`, {
    username,
    password,
  });
  return response.data;
};

export const getUserInfo = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("로그인이 필요합니다.");

  const response = await axios.get("https://front-mission.bigs.or.kr/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
