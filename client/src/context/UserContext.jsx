// client/src/context/UserContext.jsx
import { createContext, useState, useEffect, useContext} from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    user
      ? localStorage.setItem("user", JSON.stringify(user))
      : localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    token
      ? localStorage.setItem("token", token)
      : localStorage.removeItem("token");
  }, [token]);

  const login = ({ user: u, token: t }) => {
    setUser(u);
    setToken(t);
  };

  const logout = () => {
    setUser(null);
    setToken("");
  };
  console.log("User in context:", user);
  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);
export default UserContext;