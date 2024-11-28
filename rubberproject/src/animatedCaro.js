import {useEffect,React} from 'react';
import h1 from './images/h1.jpeg';
import h2 from './images/h2.jpeg';
import h3 from './images/h3.jpeg';
import './animatedCaro.css';

const Carousel = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

  return (
    <div className='setter'>    <div id="carouselExample" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active zoom-in">
          <img src={h1} className="d-block w-100" alt="First slide" />
        </div>
        <div className="carousel-item zoom-in">
          <img src={h2} className="d-block w-100" alt="Second slide" />
        </div>
        <div className="carousel-item zoom-in">
          <img src={h3} className="d-block w-100" alt="Third slide" />
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
    </div>

  );
};

export default Carousel;
