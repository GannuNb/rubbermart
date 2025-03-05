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
          <h2
  style={{ color: "rgb(28, 219, 102)" }}
  className="display-4 fw-bold mb-3 products-heading animate-heading"
>About Us</h2>

            <p
              className="lead text-light mb-4 about-text animate-paragraph"
              style={{
                lineHeight: '1.8',
                textAlign: 'justify',
                maxWidth: '800px',
                margin: '0 auto',
              }}
            >
             Rubberscrapmart.com is an India's exclusive leading B2B marketplace dedicated to the buying, selling, and trading of rubber scrap-derived products. Our platform connects recyclers, manufacturers, suppliers, and buyers from all over India, promoting sustainability and innovation in the rubber industry.
We Rubberacrapmart.com, is committed in creating a sustainable and profitable ecosystem for rubber waste and its recycled products. By leveraging cutting-edge technology and an extensive global network, we help businesses source high-quality reclaimed rubber materials, rubber scrap, rubber belt scrap, rubber granules, rubber crumb of different sizes, rubberized flooring, tire-derived products, and more.
<p>
What rubberacrapmart.com offer is
Buy & Sell Rubber Scrap & Recycled Products: A seamless platform for trading rubber waste, crumb rubber, rubber sheets, mats, flooring, and other derived products.
Verified Suppliers & Buyers: Ensuring trust and reliability in every transaction.
Competitive Pricing & Bulk Deals: Direct access to manufacturers and recyclers for cost-effective solutions.
Sustainability Focus: Promoting circular economy solutions by reducing rubber waste and encouraging eco-friendly alternatives.
</p>
<p>
Rubberacrapmart main aim is:
To bridge the gap between rubber waste suppliers, recyclers, and manufacturers by providing a transparent, efficient, and eco-conscious trading platform.

Our Vision
To be the #1 India's marketplace for rubber scrap-derived products, driving a zero-waste future through innovation and collaboration.

Join Us Today!
Whether you're a rubber recycler, manufacturer, or industrial buyer, rubberacrapmart.com is your one-stop destination for all rubber scrap and recycled product needs.
</p>

            </p>

            <button className="btn btn-lg btn-light mt-4 animate-button">
            Sign up today and become part of a growing sustainable industry!
            </button>
          </div>
        </div>

        {/* Sliding Animation Section */}
        {/* <div className="about-us-container">
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
        </div> */}
      </div>
    </div>
  );
}
