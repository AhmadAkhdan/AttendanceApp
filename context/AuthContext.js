import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Data akun yang sedang login
  const [userData] = useState({
    nim_mhs: "0920240006",
    nama: "Ahmad Akhdan Dhiaulhaq"
  });

  return (
    <AuthContext.Provider value={{ userData }}>
      {children}
    </AuthContext.Provider>
  );
};