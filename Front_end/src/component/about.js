import React from 'react';
import { motion } from 'framer-motion';
import './about.css'; 
import scatteredPopcorn from './scattered-popcorn-box-with-videotape.jpg';
import Navbar from './navbar';

function AboutUs() {
  return (
    <> <Navbar/>
    <div className="App">
      <header className="App-header">
        <motion.div
          className="header-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <h1>Welcome to real Cinema Booking system</h1>
        </motion.div>
      </header>

      <motion.section
        className="about-section"
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <div className="about-container">
          <motion.h2
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          >
            About Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            We are a passionate team dedicated to providing the best cinema experience. With a wide range of movie options, you can easily book your tickets and enjoy the latest films in comfort.
          </motion.p>
        </div>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <p>
              Our cinema booking system is designed for ease of use. We offer a seamless process for finding movies, selecting showtimes, and securing your tickets. Whether you're booking for a date night or a group outing, we've got you covered with the best experience.
            </p>
          </motion.div>

          <motion.div
            className="about-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            {/* استخدام الصورة المستوردة هنا */}
            <img src={scatteredPopcorn} alt="Cinema" />
          </motion.div>
        </div>
      </motion.section>
    </div></>
  );
}

export default AboutUs;