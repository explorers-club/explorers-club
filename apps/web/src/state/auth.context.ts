import { createContext } from 'react';
import { generateUUID } from 'three/src/math/MathUtils';

const getUserId = (() => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem('user_id', userId);
  }

  return () => {
    return userId;
  };
})();

export const AuthContext = createContext({
  userId: getUserId() as string,
  isAnon: true,
});
