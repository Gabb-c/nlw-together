import React from 'react';
import Image from 'next/image';

const Home: React.FC = () => (
  <div>
    <aside>
      <Image
        src="/assets/illustration.svg"
        alt="Ilustration"
        height={404}
        width={313}
        layout="responsive"
      />
    </aside>
  </div>
);

export default Home;
