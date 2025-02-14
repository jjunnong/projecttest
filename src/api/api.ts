import axios from "axios";

const API_BASE_URL = "https://front-mission.bigs.or.kr/auth";

export const signup = async (username: string, name: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      username,
      name,
      password,
      confirmPassword: password,
    });
    return response.data;
  } catch (error) {
    console.error("회원가입 실패", error);
    throw error;
  }
};
