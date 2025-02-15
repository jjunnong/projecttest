import axios from "axios";

const API_BASE_URL = "https://front-mission.bigs.or.kr/boards";
const AUTH_BASE_URL = "https://front-mission.bigs.or.kr/auth";

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${AUTH_BASE_URL}/refresh`, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return accessToken;
  } catch {
    return null;
  }
};

const getAuthHeader = async () => {
  const token = localStorage.getItem("accessToken") || (await refreshAccessToken());
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBoardList = async (page: number, size: number) => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}?page=${page}&size=${size}`, { headers });
  return response.data;
};

export const getBoardDetail = async (id: number) => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/${id}`, { headers });
  return response.data;
};

export const getBoardCategories = async () => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/categories`, { headers });
  return response.data;
};

export const createBoard = async (title: string, content: string, category: string, file?: File) => {
  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify({ title, content, category })], { type: "application/json" }));
  if (file) formData.append("file", file);

  const headers = await getAuthHeader();
  const response = await axios.post(API_BASE_URL, formData, { headers });
  return response.data;
};

export const updateBoard = async (id: number, title: string, content: string, category: string, file?: File) => {
  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify({ title, content, category })], { type: "application/json" }));
  if (file) formData.append("file", file);

  const headers = await getAuthHeader();
  const response = await axios.patch(`${API_BASE_URL}/${id}`, formData, { headers });
  return response.data;
};

export const deleteBoard = async (id: number) => {
  const headers = await getAuthHeader();
  await axios.delete(`${API_BASE_URL}/${id}`, { headers });
};
