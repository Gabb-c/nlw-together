import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import nookies from 'nookies';

import { Button } from 'src/components/Button';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPropsResult,
  InferGetServerSidePropsType,
} from 'next';
import { toast } from 'react-toastify';
import { FirebaseRoom } from 'src/models/firebase-room';
import { useAuth } from 'src/contexts/auth';
import { useRouter } from 'next/router';
import { firebaseAdmin } from '../services/firebase/firebase-admin';
import { database } from '../services/firebase/firebase';

import styles from '../styles/pages/new-room.module.scss';

export const getServerSideProps: GetServerSideProps<firebaseAdmin.auth.DecodedIdToken> = async (
  ctx: GetServerSidePropsContext
): Promise<GetStaticPropsResult<firebaseAdmin.auth.DecodedIdToken>> => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    return { props: token };
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {} as never,
    };
  }
};

const NewRoom = (props: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // const { uid } = props;

  const handleCreateNewRoom = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (value.trim() === '') {
      toast.warn('Every room must have a name...');
      return;
    }

    setLoading(true);

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: value,
      authorId: user?.uid || 0,
      questions: {},
    } as FirebaseRoom);

    if (firebaseRoom.key) {
      await router.push(`/rooms/${firebaseRoom.key}`);
    } else {
      toast.error(`Room doesn't have a key...`);
    }
    setLoading(false);
  };

  return (
    <div className={styles.newRoom}>
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
          <h2>Create a new room</h2>
          <form onSubmit={handleCreateNewRoom}>
            <input
              type="text"
              placeholder="Room name"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue(event.target.value);
              }}
              value={value}
            />
            {loading ? (
              <Image src="/assets/loading.svg" width={60} height={60} />
            ) : (
              <Button type="submit" disabled={loading}>
                Create
              </Button>
            )}
          </form>
          <p>
            Wanna join in a <Link href="/">room</Link>?
          </p>
        </div>
      </main>
    </div>
  );
};

export default NewRoom;
