import React from 'react';
import Logo from '../assets/logo.svg';
import { Container, ImageContainer } from '../styles/pages/home';

const Home: React.FC = () => (
  <Container>
    <ImageContainer>
      <Logo />
    </ImageContainer>
  </Container>
);

export default Home;
