import React, { useState } from "react";
import "./Slider.css"; // Make sure you have the appropriate styles

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image: "src/images/home.jpeg", // Your image
      heading: "We Provide Medical Services That You Can Trust!",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed nisl pellentesque, faucibus libero eu, gravida quam.",
      button1: "Get Appointment",
      button2: "Learn More",
    },
    {
      id: 2,
      image: "img/slider.jpg",
      heading: "We Provide Medical Services That You Can Trust!",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed nisl pellentesque, faucibus libero eu, gravida quam.",
      button1: "Get Appointment",
      button2: "About Us",
    },
    {
      id: 3,
      image: "img/slider3.jpg",
      heading: "We Provide Medical Services That You Can Trust!",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed nisl pellentesque, faucibus libero eu, gravida quam.",
      button1: "Get Appointment",
      button2: "Contact Now",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
    <div className="setter">
    <section className="slider">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`single-slider ${
              index === currentIndex ? "active" : "inactive"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-7">
                  <div className="text">
                    <h1>
                      {slide.heading.split(" ").map((word, i) =>
                        word === "Medical" || word === "Trust!" ? (
                          <span key={i}>{word} </span>
                        ) : (
                          word + " "
                        )
                      )}
                    </h1>
                    <p>{slide.text}</p>
                    <div className="button">
                      <a href="#" className="btn">
                        {slide.button1}
                      </a>
                      <a href="#" className="btn primary">
                        {slide.button2}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={prevSlide} className="prev">
          &#10094;
        </button>
        <button onClick={nextSlide} className="next">
          &#10095;
        </button>
      </div>
    </section>
    </div>
    </>
  );
};

export default Slider;
