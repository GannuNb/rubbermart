import React, { useState, useEffect } from "react";
import "./AboutUsPage.css";

export default function AboutUsPage() {
  const [paused, setPaused] = useState(false);  // State to track if animation is paused
  const [currentSlide, setCurrentSlide] = useState(0);  // State to track the current slide
  const [pauseIndex, setPauseIndex] = useState(null);  // State to track which slide is paused

  const slides = [
    {
      class: "slide-left",
      title: "Who We Are: Our Story",
      content: "We are a passionate team on a mission to change the world. With years of experience and a relentless pursuit of excellence, we innovate to create solutions that make life easier, better, and more exciting. Our core values? Integrity, creativity, and collaboration."
    },
    {
      class: "slide-bottom",
      title: "Our Exceptional Team",
      content: "We are a diverse group of thinkers, dreamers, and achievers, united by one goal – to deliver extraordinary results. Our team is the heart of our success. With a blend of expertise and a drive to constantly evolve, we bring the best of innovation and strategy to every project we undertake."
    },
    {
      class: "slide-right",
      title: "Building Relationships, Not Just Partnerships",
      content: "We don't just work with clients; we build lasting relationships. Trust, collaboration, and mutual respect form the foundation of every connection we make. Together, we create solutions that not only meet expectations but exceed them, driving growth and success for everyone involved."
    }
  ];

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        setPauseIndex(null);  // Reset the pause state when switching to the next slide
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [paused]);

  const handlePause = () => {
    setPaused(!paused);
    setPauseIndex(currentSlide);  // Set the paused slide when button is clicked
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    setPauseIndex(null);  // Reset pause when moving to next slide
  };

  const handlePrev = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    setPauseIndex(null);  // Reset pause when moving to previous slide
  };

  return (
    <div className="setter">
      <div className="about-us-page">
        {/* Gradient Background Section */}
        <div className="about-bg py-5">
          <div className="container text-center">
            <h2 className="display-4 fw-bold mb-3 text-primary products-heading animate-heading">
              About Us
            </h2>

            <p
              className="lead text-light mb-4 about-text animate-paragraph"
              style={{
                lineHeight: '1.8',
                textAlign: 'justify',
                maxWidth: '800px',
                margin: '0 auto',
              }}
            >
              At <span className="brand-name">Vikah Rubber</span>, we are committed to being a leading provider of high-quality
              rubber products that meet the diverse needs of our customers. Our focus on innovation and sustainability drives
              us to develop solutions that not only enhance performance but also minimize environmental impact. With a team of
              experienced professionals and a dedication to excellence, we strive to exceed customer expectations through
              reliable service and superior products. Join us on our journey to a greener, more sustainable future.
            </p>

            <button className="btn btn-lg btn-light mt-4 animate-button">
              Learn More
            </button>
          </div>
        </div>

        {/* Sliding Animation Section */}
        <div className="about-us-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${slide.class} ${index === currentSlide ? "active" : ""} ${index === pauseIndex ? "paused" : ""}`}
              style={{
                animationPlayState: paused && index === currentSlide ? "paused" : "running",
              }}
            >
              <h2>{slide.title}</h2>
              <p>{slide.content}</p>
            </div>
          ))}
          <div className="controls">
            <button onClick={handlePrev}>Previous</button>
            <button onClick={handleNext}>Next</button>
            <button onClick={handlePause}>{paused ? "Resume" : "Pause"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
