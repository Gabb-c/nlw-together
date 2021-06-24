import React from 'react';
import Image from 'next/image';

import { Button } from 'src/components/Button';
import styles from '../styles/pages/auth.module.scss';

const Home: React.FC = () => (
  <div className={styles.pageAuth}>
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
        <button type="button" className={styles.createRoom}>
          <div className={styles.googleLogo}>
            <Image src="/assets/google-icon.svg" alt="googleIcon" width={24} height={24} />
          </div>
          Crie sua sala com o Google
        </button>
        <div className={styles.separator}>Ou entre em uma sala</div>
        <form>
          <input type="text" placeholder="Digite o código da sala" />
          <Button type="submit">Entrar na sala</Button>
        </form>
      </div>
    </main>
  </div>
);

export default Home;
