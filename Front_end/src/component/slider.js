import React, { useState, useEffect } from "react";
import "./slider.css";
import firstpic from "../images/slider-1.jpg";
import secondpic from "../images/slider-2 .jpg";
import thirdpic from "../images/slider-3.jpg";

const Slider = () => {
  const images = [
    {
      src: firstpic,
      title: "Special Cinemas",
      desc: "It's Not Just A Ticket. It's Living An Adventure",
    },
    {
      src: secondpic,
      title: "Easy Booking",
      desc: "Now You Can Book Your Ticket From Home.",
    },
    {
      src: thirdpic,
      title: "Good Experience",
      desc: "Start Your Journey And Have Fun.",
    },
  ];

  const [slideIndex, setSlideIndex] = useState(0);

  // Move to the next slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Adjust the interval duration if needed
    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  const nextSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="slider-container">
      {/* <i
        className="bi bi-chevron-double-left arrow-left"
        onClick={prevSlide}
      ></i> */}
      <div
        className="slider-wrapper"
        style={{ transform: `translateX(${slideIndex * -100}vw)` }}
      >
        {images.map((image, index) => (
          <div className="slide" key={index}>
            <div className="slide-img-wrapper">
              <img src={image.src} alt={`slider-img-${index}`} />
            </div>
            <div className="slide-info-wrapper">
              <h1 className="slide-info-title">{image.title}</h1>
              <p className="slide-info-desc">{image.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {/* <i
        className="bi bi-chevron-double-right arrow-right"
        onClick={nextSlide}
      ></i> */}
    </div>
  );
};

export default Slider;

