import { createContext, useState, useEffect } from "react";
import axios from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.get("/auth/me")
        .then(res => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post("/auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      setError("");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (data) => {
    try {
      const res = await axios.post("/auth/register", data);
    //   localStorage.setItem("token", res.data.token);
    //   axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    //   setUser(res.data.user);
      setError("");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}
