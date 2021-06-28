import Image from 'next/image';
import React from 'react';
import { toast } from 'react-toastify';

import styles from './room-code.module.scss';

export interface RoomCodeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Room code to copy */
  code: string;
}

export const RoomCode: React.FC<RoomCodeProps> = (props: RoomCodeProps): JSX.Element => {
  const { code, type } = props;

  const toClipboard = async (): Promise<void> => {
    await navigator.clipboard.writeText(code);
    toast.dark('Copied to clipboard!');
  };

  return (
    <button className={styles.roomCode} type={'button' || type} onClick={toClipboard}>
      <div className={styles.copyImg}>
        <Image src="/assets/copy.svg" width={20} height={40} />
      </div>
      <span>Sala {code}</span>
    </button>
  );
};
