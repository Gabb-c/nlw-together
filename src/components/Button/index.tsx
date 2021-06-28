import React, { ButtonHTMLAttributes } from 'react';

import styles from './button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOutlined?: boolean;
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps): JSX.Element => {
  const { children, isOutlined } = props;

  return (
    <button className={`${styles.button} ${isOutlined ? styles.outlined : ''}`} {...props}>
      {children}
    </button>
  );
};
