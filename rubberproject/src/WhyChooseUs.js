import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const scrapSectionRef = useRef(null);  // Create ref to track the target section

  // Scroll function
  const handleScrollToScrapSection = () => {
    scrapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { title: 'Best Prices', desc: 'Get top rates for all types of scrap.' },
    { title: 'Free Pickup', desc: 'We collect your scrap right from your doorstep.' },
    { title: 'Quick Payments', desc: 'Receive instant cash or online payments.' },
    { title: 'Eco-Friendly', desc: 'Contribute to a cleaner, greener planet.' },
  ];

  return (
    <div className="container my-5">
      {/* Page Header */}
      <section className="text-center py-5 bg-light rounded shadow-sm fade-in">
        <h1 className="text-primary fw-bold display-4">🌟 Why Choose Us?</h1>
        <p className="lead text-muted">Discover what makes us the best choice for scrap selling.</p>
      </section>

      {/* Features Section */}
      <section className="my-5">
        <div className="row text-center">
          {features.map((item, index) => (
            <div className="col-md-3 mb-3" key={index}>
              <div className={`card shadow-sm h-100 feature-card delay-${index + 1}`}>
                <div className="card-body">
                  <h5 className="card-title text-primary fw-bold">{item.title}</h5>
                  <p className="card-text text-muted">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Scroll Target Section */}
      <section ref={scrapSectionRef} className="my-5 py-5 bg-light rounded shadow-sm text-center fade-in">
        <h2 className="text-success fw-bold">🚀 Ready to Sell Your Scrap?</h2>
        <p className="lead text-muted">Contact us now and turn your scrap into cash!</p>
      </section>
    </div>
  );
};

export default WhyChooseUs;
