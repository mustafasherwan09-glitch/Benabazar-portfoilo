import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Services from './Services';
import Process from './Process';
import Feedbacks from './Feedbacks';
import Contact from './Contact';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { useLocation } from 'react-router-dom';

const Home = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [hash]);

    return (
        <>
            <Navbar />
            <Hero />
            <Services />
            <Process />
            <Feedbacks />
            <Contact />
            <Footer />
            <ScrollToTop />
        </>
    );
};

export default Home;
