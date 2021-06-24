import React from 'react';

import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import '../services/firebase/firebase';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.scss';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }): JSX.Element => (
  <>
    <Component {...pageProps} />
    <ToastContainer />
  </>
);

export default MyApp;
