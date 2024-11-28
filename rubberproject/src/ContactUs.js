import React, { useEffect,useState } from 'react';
import './ContactUs.css';
import './Sell.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormStatus('Your message has been sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('Failed to send your message. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setFormStatus('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

  return (
    <div className='setter'>
      <div className="container contact-us-page my-5">
        <div className="row">
          {/* Contact Form Section */}
          <div className="col-lg-6 mb-4">
            <h2 className="mb-4">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
              <div className="form-group mb-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Please enter your name.</div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Please enter a valid email address.</div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="message">Message</label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="4"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <div className="invalid-feedback">Please enter your message.</div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
            {formStatus && <p className="mt-3">{formStatus}</p>}
          </div>

          {/* Contact Information Section */}
          <div className="col-lg-5 mb-4">
            <h2 className="mb-4">Contact Information</h2>
            <ul className="list-unstyled">
              <li><i className="fas fa-map-marker-alt me-2"></i>Admin Off : #406, 4th Floor, Patel Towers, Above EasyBuy Beside Nagole RTO Office, Nagole Hyderabad, Telangana-500035</li>
              <br />
              <li><i className="fas fa-phone-alt me-2"></i>+914049471616</li>
              <li><i className="fas fa-envelope me-2"></i> Info@vikahecotech.com</li>
            </ul>

            <div className="map-container mb-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.9044812055836!2d78.55505387422595!3d17.36832870335573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99eeab8a7795%3A0x89760778e2498478!2sPatel%20Towers!5e0!3m2!1sen!2sin!4v1728364217182!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

{/* Social Media Links */}
<div className="social-icons">
  <h4>Follow Us</h4>
  <a href="https://www.facebook.com/people/Vikah-Ecotech/61562484014600/?mibextid=qi2Omg&rdid=DtTaZ8FyfC8gsDCh&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Mxsd16XWYMsvCyi%2F%3Fmibextid%3Dqi2Omg" target="_blank" rel="noopener noreferrer" className="me-3">
    <i className="fab fa-facebook fa-2x text-primary"></i> {/* Facebook - Blue */}
  </a>
  <a href="https://x.com/i/flow/login?redirect_after_login=%2Fvikahecotech" target="_blank" rel="noopener noreferrer" className="me-3">
    <i className="fab fa-twitter fa-2x text-info"></i> {/* Twitter - Light Blue */}
  </a>
  <a href="https://www.instagram.com/vikahecotech/" target="_blank" rel="noopener noreferrer" className="me-3">
    <i className="fab fa-instagram fa-2x text-danger"></i> {/* Instagram - Red */}
  </a>
  <a href="https://www.youtube.com/@vikahecotech" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-youtube fa-2x text-danger"></i> {/* YouTube - Red */}
  </a>
</div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="row mt-5">
          <div className="col-lg-12">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <div className="accordion" id="faqAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    How can I get in touch with customer service?
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    You can reach us via the form above or by calling +914049471616 during business hours.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Where are you located?
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    Our office is located at #406, 4th Floor, Patel Towers, Above EasyBuy Beside Nagole RTO Office, Nagole Hyderabad, Telangana-500035, India.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
