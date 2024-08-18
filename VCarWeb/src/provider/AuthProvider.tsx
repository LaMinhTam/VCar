import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { loginUser } from "../store/authSlice";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Update the isAuthenticated state based on authState changes
  useEffect(() => {
    if (authState.token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [authState.token]);

  const login = async (email: string, password: string) => {
    await dispatch(loginUser({ email, password }));
  };

  const logout = () => {
    dispatch({ type: "auth/logout" });
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
