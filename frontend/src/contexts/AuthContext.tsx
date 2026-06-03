"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "none" | "patient" | "doctor";

interface AuthUser {
  name: string;
  email: string;
  specialty?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  role: UserRole;
  user: AuthUser | null;
  login: (role: UserRole, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("none");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Load from local storage on mount
    const savedRole = localStorage.getItem("authRole") as UserRole;
    const savedUser = localStorage.getItem("authUser");
    if (savedRole && savedUser) {
      setRole(savedRole);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
  }, []);

  const login = (newRole: UserRole, newUser: AuthUser) => {
    setRole(newRole);
    setUser(newUser);
    localStorage.setItem("authRole", newRole);
    localStorage.setItem("authUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setRole("none");
    setUser(null);
    localStorage.removeItem("authRole");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
