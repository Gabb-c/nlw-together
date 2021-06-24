import React, { ButtonHTMLAttributes } from 'react';

import styles from './button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = (props): JSX.Element => {
  const { children } = props;

  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
};
