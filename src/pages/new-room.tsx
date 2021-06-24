import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from 'src/components/Button';
import styles from '../styles/pages/new-room.module.scss';

const NewRoom: React.FC = () => (
  <div className={styles.newRoom}>
    <aside>
      <div className={styles.asideImage}>
        <Image src="/assets/illustration.svg" alt="Ilustration" height={404} width={313} />
      </div>
      <strong>Toda pergunta tem uma resposta.</strong>
      <p>Aprenda e compartilhe conhecimento com outras pessoas!</p>
    </aside>
    <main>
      <div className={styles.mainContent}>
        <div className={styles.logoImg}>
          <Image src="/assets/logo.svg" alt="Letmeask" width={157} height={75} />
        </div>
        <h2>Criar uma nova sala</h2>
        <form>
          <input type="text" placeholder="Nome da sala" />
          <Button type="submit">Criar sala</Button>
        </form>
        <p>
          Quer entrar em uma <Link href="/">sala existente</Link>{' '}
        </p>
      </div>
    </main>
  </div>
);

export default NewRoom;
