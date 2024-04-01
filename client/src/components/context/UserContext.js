import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  // const [isInit, setIsInit] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const savedId = sessionStorage.getItem('userId');
    const savedRole = sessionStorage.getItem('userRole');
    if (savedId) {
      setUserId(savedId);
      setUserRole(savedRole);
    }
  }, []);

  useEffect(() => {
    // if (isInit) {
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('userRole', userRole)
    // }
  }, [userId, userRole]
  );

  return (
    <UserContext.Provider value={{ userId, setUserId, userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};
