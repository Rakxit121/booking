import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const getUserProfile = () => {
    if (!user) {
      axios.get("/api/auth/profile").then((res) => {
        setUser(res.data.userInfo);
      });
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
