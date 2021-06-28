import Image from 'next/image';
import React from 'react';
import { IQuestion } from 'src/models/firebase-question';

import styles from './question.module.scss';

export interface QuestionProps extends IQuestion {
  children?: React.ReactNode;
}

export const Question: React.FC<QuestionProps> = (props: QuestionProps): JSX.Element => {
  const { author, content, children } = props;

  return (
    <div className={styles.question}>
      <p>{content}</p>
      <footer>
        <div className={styles.userInfo}>
          <Image src={author.avatar as string} alt="author profile image" width={24} height={24} />
          <span>{author.name}</span>
        </div>
        <div>{children || <></>}</div>
      </footer>
    </div>
  );
};
