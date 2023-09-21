'use client';

import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext<{
  authStatus: boolean;
  setAuthStatus: (status: boolean) => void;
}>({
  authStatus: false,
  setAuthStatus: () => {},
});

export const AuthContextProvider = ({ children }: any) => {
  const [authStatus, setAuthStatus] = useState(false);

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
