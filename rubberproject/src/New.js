import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './New.css'

const New = () => {
  const sliderImages = [
    { img: 'img/slider.jpg', alt: 'Slider 1' },
    { img: 'img/slider2.jpg', alt: 'Slider 2' },
    { img: 'img/slider3.jpg', alt: 'Slider 3' },
  ];

  return (
    <div>
      <section className="slider">
        <OwlCarousel className="hero-slider owl-carousel" loop margin={10} nav>
          {sliderImages.map((slide, index) => (
            <div key={index} className="single-slider" style={{ backgroundImage: `url(${slide.img})` }}>
              <div className="container">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="text">
                      <h1>
                        We Provide <span>Medical</span> Services That You Can <span>Trust!</span>
                      </h1>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      <div className="button">
                        <a href="#" className="btn">Get Appointment</a>
                        <a href="#" className="btn primary">About Us</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </OwlCarousel>
      </section>

      <section className="schedule">
        <div className="schedule-inner">
          <div className="single-schedule">
            <div className="inner">
              <span>Monday - Friday</span>
              <h4>Consultation Hours</h4>
              <ul className="time-sidual">
                <li>Morning <span>8:00 AM - 12:00 PM</span></li>
                <li>Afternoon <span>1:00 PM - 5:00 PM</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default New;
