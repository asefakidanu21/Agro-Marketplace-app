


import { createContext, useContext, useEffect, useState } from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  getToken,
  removeToken,
} from "../features/auth/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether the user is already logged in
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await getToken();

        if (token) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        await removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // Login
  const login = async (email, password) => {
    const result = await loginUser({ email, password });
    setUser(result.user);
    return result.user;
  };

  // Register
  const register = async (userData) => {
    const result = await registerUser(userData);
    setUser(result.user);
    return result.user;
  };

  // Logout
  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Access authentication from any screen
export const useAuth = () => {
  return useContext(AuthContext);
};
