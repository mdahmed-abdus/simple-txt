'use client';

import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext<{
  authStatus: boolean;
  user: { name: string; email: string };
  setAuthStatus: (status: boolean) => void;
  setUser: ({ name, email }: { name: string; email: string }) => void;
}>({
  authStatus: false,
  user: { name: '', email: '' },
  setAuthStatus: () => {},
  setUser: () => {},
});

export const AuthContextProvider = ({ children }: any) => {
  const [authStatus, setAuthStatus] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });

  return (
    <AuthContext.Provider value={{ authStatus, user, setAuthStatus, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
