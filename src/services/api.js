import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",  // Backend API
    withCredentials: true, // Ensures cookies are sent
});

// Google OAuth API Request
export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
