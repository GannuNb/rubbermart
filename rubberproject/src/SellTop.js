import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SellTop.css';

const SellTop = () => {
  const categories = [
    {
      title: 'Tyre Scrap',
      items: [
        'Mulch PCR',
        'Baled Tyres PCR',
        'Three Piece PCR',
        'Baled Tyres TBR',
        'Three Piece TBR',
        'Rubber Granules/ Crum',
        'Shreds',
      ],
    },
    {
      title: 'Pyro Oil',
      items: ['Pyro Oil'],
    },
    {
      title: 'Tyre Steel Scrap',
      items: ['Rubber Crum Steel', 'Pyro Steel'],
    },
  ];

  return (
    <div className="selltop-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="animate-fade-in">Become a RubberScrap Partner</h1>
<p className="animate-fade-in">
  Sell your scrap effortlessly while making a positive impact on the environment. By choosing to recycle your scrap materials, you're not only clearing out unwanted items but also contributing to a sustainable future. Join us in the effort to reduce waste, conserve resources, and lower carbon footprints. Our easy, hassle-free process ensures that you can sell your scrap quickly and responsibly, all while supporting eco-friendly practices that benefit our planet. Together, we can create a cleaner, greener world for generations to come.
</p>
          <button className="hero-btn animate-bounce" aria-label="Sell scrap now">Sell Now</button>
      </section>

      {/* Categories Section */}
      {/* <section className="categories-section animate-slide-up">
        <h2>What We Accept</h2>
        <div className="category-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card animate-zoom-in">
              <h3>{category.title}</h3>
              <ul>
                {category.items.map((item, idx) => (
                  <li key={idx} className="item-pill">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section> */}

      {/* Call to Action */}
      {/* <section className="cta-section animate-fade-in">
        <h2>Ready to Get Started?</h2>
        <button className="sell-btn" aria-label="Sell your scrap now">Sell Your Scrap Now</button>
      </section> */}
    </div>
  );
};

SellTop.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
};

export default SellTop;
