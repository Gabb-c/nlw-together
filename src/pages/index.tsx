import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button } from 'src/components/Button';

import { useAuth } from 'src/contexts/auth';
import { toast } from 'react-toastify';
import { database } from '../services/firebase/firebase';
import styles from '../styles/pages/auth.module.scss';

const Home: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>('');
  const { user, signInWithGoogle } = useAuth();

  const handleGoogleAuth = async () => {
    if (!user) {
      await signInWithGoogle().catch((error: Error) =>
        toast.dark(error.message || 'Google Authentication failed...')
      );
    }
    await router.push('/new-room');
  };

  /* const handleTwitterAuth = async () => {
    if (!user) {
      await signInWithTwitter().catch((error: Error) =>
        toast.error(error.message || 'Google Authentication failed...')
      );
    }
    await router.push('/new-room');
  };

  const handleGithubAuth = async () => {
    if (!user) {
      await signInWithGithub().catch((error: Error) =>
        toast.error(error.message || 'Google Authentication failed...')
      );
    }
    await router.push('/new-room');
  };
  */

  const handleJoinRoom = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (roomCode.trim() === '') {
      toast.dark('Empty room code...');
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    if (!roomRef.exists() || roomRef.val().endedAt) {
      toast.dark(`Room doesn't exists...`);
      return;
    }
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    await router.push(`rooms/${roomCode}`);
  };

  return (
    <div className={styles.pageAuth}>
      <aside>
        <div className={styles.asideImage}>
          <Image src="/assets/illustration.svg" alt="Ilustration" height={404} width={313} />
        </div>
        <strong>Every question has an answer</strong>
        <p>Learn and share knowledge with others!</p>
      </aside>
      <main>
        <div className={styles.mainContent}>
          <div className={styles.logoImg}>
            <Image src="/assets/logo.svg" alt="Letmeask" width={157} height={75} />
          </div>
          <button type="button" className={styles.googleCreateRoom} onClick={handleGoogleAuth}>
            <div className={styles.googleLogo}>
              <Image src="/assets/google-icon.svg" alt="googleIcon" width={24} height={24} />
            </div>
            Create room with Google
          </button>
          {/* <button type="button" className={styles.twitterCreateRoom} onClick={handleTwitterAuth}>
            <div className={styles.twitterLogo}>
              <Image src="/assets/twitter.svg" alt="twiterIcon" width={24} height={24} />
            </div>
            Crie sua sala com o Twitter
          </button>
          <button type="button" className={styles.githubCreateRoom} onClick={handleGithubAuth}>
            <div className={styles.githubLogo}>
              <Image src="/assets/github.svg" alt="githubIcon" width={24} height={24} />
            </div>
            Crie sua sala com o Github
            </button> */}
          <div className={styles.separator}>or join in a room!</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setRoomCode(event.target.value)
              }
            />
            {loading ? (
              <Image src="/assets/loading.svg" width={60} height={60} />
            ) : (
              <Button type="submit" disabled={loading}>
                Join
              </Button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
