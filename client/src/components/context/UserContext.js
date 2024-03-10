import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    const savedId = sessionStorage.getItem('userId');
    if (savedId) {
      setUserId(savedId);
    }
    setIsInit(true);
  }, []);

  useEffect(() => {
    if (isInit) {
      sessionStorage.setItem('userId', userId);
    }
  }, [userId, isInit]
  );

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};


