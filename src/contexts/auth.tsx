// User Auth Context

import nookies from 'nookies';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

import { firebase, auth } from '../services/firebase/firebase';

export interface UserContext {
  user: firebase.User | undefined;
  signInWithGoogle: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
}

const AuthContext = createContext<UserContext>({} as UserContext); // * Create a context

export interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider: React.FC = (props: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<firebase.User | undefined>();

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL || !uid) {
        throw new Error('Missing information from Google Account...');
      }

      setUser(result.user);
    }
  };

  const signInWithTwitter = async (): Promise<void> => {
    const provider = new firebase.auth.TwitterAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL || !uid) {
        throw new Error('Missing information from Twitter Account...');
      }

      setUser(result.user);
    }
  };

  const signInWithGithub = async (): Promise<void> => {
    const provider = new firebase.auth.GithubAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL || !uid) {
        throw new Error('Missing information from Github Account...');
      }

      setUser(result.user);
    }
  };

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

  /* eslint-disable @typescript-eslint/no-misused-promises */
  useEffect(() => {
    const handle = setInterval(async () => {
      const loggedUser = firebase.auth().currentUser;
      if (loggedUser) await loggedUser.getIdToken(true);
    }, 10 * 60 * 1000);
    // clean up setInterval
    return () => clearInterval(handle);
  }, []);
  /* eslint-enable @typescript-eslint/no-misused-promises */

  const { children } = props;

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithTwitter, signInWithGithub }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): UserContext => useContext(AuthContext);
