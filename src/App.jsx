import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Feedbacks from './components/Feedbacks';
import Contact from './components/Contact';
import Footer from './components/Footer';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Feedbacks />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
