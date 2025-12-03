import { createContext, useState, useEffect } from "react";
import api from "../api/axios.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      api.setToken(token);
      localStorage.setItem("token", token);
      // fetch current user
      api.get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          setUser(null);
          setToken(null);
          api.setToken(null);
          localStorage.removeItem("token");
        });
    } else {
      setUser(null);
      api.setToken(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
