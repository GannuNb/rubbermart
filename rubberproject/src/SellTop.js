import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SellTop.css';

const SellTop = () => {
  const [showFullList, setShowFullList] = useState(false);
  const scrapSectionRef = useRef(null);  // Ref for smooth scrolling

  const categories = [
    {
      title: 'Tyre Scrap',
      items: [
        'Mulch pcr',
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
      items: ['Pyro oil'],
    },
    {
      title: 'Tyre Steel Scrap',
      items: ['Rubber Crum Steel', 'Pyro Steel'],
    },
  ];

  // Scroll to scrap section
  const handleScrollToScrapSection = () => {
    scrapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container my-5">
      {/* Hero Section */}
      <section className="text-center py-5 bg-light rounded shadow-sm fade-in">
        <h1 className="text-primary fw-bold display-4">♻️ Sell Your Scrap — Quick & Easy! 💰</h1>
        <p className="lead text-muted">
          Turn your old scrap into cash while helping the environment. We offer the best rates and hassle-free pickup.
        </p>
        <button
          className="btn btn-success btn-lg mt-3 bounce-in"
          onClick={handleScrollToScrapSection}  // Scroll action
        >
          Get Started Now
        </button>
      </section>


      {/* What We Accept Section */}
      <section className="my-5" ref={scrapSectionRef}> {/* Scroll Target */}
        <h2 className="text-success text-center mb-4 fade-in">What We Accept</h2>
        <div className="row text-center">
          {categories.map((category, index) => (
            <div key={index} className="col-md-4 mb-3">
              <div className="card shadow-sm h-100 zoom-in">
                <div className="card-body">
                  <h5 className="card-title text-warning fw-bold">{category.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toggle Full List */}
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary scale-on-hover" onClick={() => setShowFullList(!showFullList)}>
            {showFullList ? ' Full List' : 'See Full List'}
          </button>
        </div>

        {/* Full List */}
        <div className={`full-list-container mt-4 ${showFullList ? 'show' : ''}`}>
          <div className="row">
            {categories.map((category, index) => (
              <div key={index} className="col-md-4 mb-4 scale-in">
                <div className="card h-100 shadow-sm card-glow">
                  <div className="card-header bg-primary text-white fw-bold">{category.title}</div>
                  <ul className="list-group list-group-flush">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="list-group-item">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <section className="text-center">
          <button
            className="btn btn-success btn-lg bounce-in"
            onClick={handleScrollToScrapSection}  // Same scroll action here
          >
            Sell Your Scrap Now
          </button>
        </section>
      </section>
    </div>
  );
};

export default SellTop;
