// User Auth Context

import nookies from 'nookies';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

import { firebase } from '../services/firebase/firebase';

export interface UserContext {
  user: firebase.User | undefined;
}

const AuthContext = createContext<UserContext>({} as UserContext); // * Create a context

export function AuthProvider(children: ReactNode): JSX.Element {
  const [user, setUser] = useState<firebase.User | undefined>();

  // Check if the user token is valid
  useEffect(
    () =>
      firebase.auth().onIdTokenChanged(async (activeUser: firebase.User | null) => {
        if (!activeUser) {
          nookies.set(undefined, 'token', '', { path: '/' });
        } else {
          const token = await activeUser.getIdToken();
          setUser(activeUser);
          nookies.set(undefined, 'token', token, { path: '/' });
        }
      }),
    []
  );

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export const useAuth = (): UserContext => useContext(AuthContext);
