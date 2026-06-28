import React from 'react';
import Awards from './Awards';
import Education from './Education';
import Hero from './Hero';
import Pricing from './Pricing';
import Trust from './Trust';
import OpenAccount from '../OpenAccount';

function HomePage() {
    return ( 
        <>
        <Hero />
        <Awards />
        <Trust />
        <Pricing />
        <Education />
        <OpenAccount />
        </>
     );
}

export default HomePage;