import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getToken, getUser } from '../../Services/Users/localStorageService';
import { getUserData } from '../../Services/Users/usersApiService';

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      const userFromLocalStorage = getUser();
      setUser(userFromLocalStorage);
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await getUserData(user._id);
          setUserData(data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const value = useMemo(() => ({
    user,
    token,
    setToken,
    setUser,
    userData,
    loading,
  }), [token, user, userData, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useMyUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useMyUser must be used inside a Provider");
  return context;
}
