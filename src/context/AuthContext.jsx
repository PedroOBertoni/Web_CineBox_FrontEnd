import { createContext, useState } from "react";

export const AuthContext = createContext();

const SESSION_KEY = "cinebox_session";
const USERS_KEY = "cinebox_users";

const getUsers = () => JSON.parse(sessionStorage.getItem(USERS_KEY) || "[]");
const saveUsers = (users) => sessionStorage.setItem(USERS_KEY, JSON.stringify(users));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = sessionStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  });

  const register = (email, password, name) => {
    const users = getUsers();
    const exists = users.find((u) => u.email === email);
    if (exists) return { ok: false, error: "Este e-mail já está cadastrado nesta sessão." };
    const newUser = { email, password, name };
    saveUsers([...users, newUser]);
    const session = { email, name };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { ok: false, error: "E-mail ou senha incorretos." };
    const session = { email, name: found.name };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
