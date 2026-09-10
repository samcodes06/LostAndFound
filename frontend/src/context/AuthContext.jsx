import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api from "../api/axios";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/profile");

        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to load user", error);

        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    }, []);
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}