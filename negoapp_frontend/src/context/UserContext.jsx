import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userId, setUserIdState] = useState(
    () => localStorage.getItem('negoapp_user_id') || ''
  );

  const setUserId = (id) => {
    localStorage.setItem('negoapp_user_id', id);
    setUserIdState(id);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser doit être utilisé dans un UserProvider');
  return ctx;
}