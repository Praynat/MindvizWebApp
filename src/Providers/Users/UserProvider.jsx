import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getToken, getUser, removeToken } from '../../Services/Users/localStorageService';
import { getUserData } from '../../Services/Users/usersApiService';

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);

  const clearAuthData = () => {
    setUser(null);
    setUserData(null);
    setToken(null);
    removeToken();
  };
  useEffect(() => {
    if (!user) {
      const userFromLocalStorage = getUser();
      if (userFromLocalStorage) {
        setUser(userFromLocalStorage);
      } else {
        // If no user in localStorage, ensure token is cleared too
        setToken(null);
        removeToken();
      }
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setLoading(true);
          const data = await getUserData(user._id);
          
          if (!data) {
            clearAuthData();
          } else {
            setUserData(data);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          clearAuthData();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
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
    clearAuthData,
  }), [token, user, userData, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useMyUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useMyUser must be used inside a Provider");
  return context;
}
