import React, { useEffect, useState } from "react";
import "./ContactUs.css";
import "./Sell.css";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

   useEffect(() => {
          // Directly set the scroll position to the top of the page
          document.documentElement.scrollTop = 0; 
          document.body.scrollTop = 0;  // For compatibility with older browsers
        }, []); // Empty dependency array ensures it runs only once on page load
        
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setFormStatus("Your message has been sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormStatus("Failed to send your message. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setFormStatus("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="setter">
      <div className="container contact-us-page my-5">
        <div className="row">
          <div className="col-lg-6 mb-4">
            <h2 className="mb-4">Get in Touch</h2>
            <form
              onSubmit={handleSubmit}
              className="needs-validation"
              noValidate
            >
              <div className="form-group mb-3">
                <label htmlFor="name" className="text-black">
                  Name
                </label>
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
                <label htmlFor="email" className="text-black">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Please enter a valid email address.
                </div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="message" className="text-black">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="4"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <div className="invalid-feedback">
                  Please enter your message.
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
            {formStatus && <p className="mt-3">{formStatus}</p>}
          </div>

          <div className="col-lg-5 mb-4">
            <h2 className="mb-4">Contact Information</h2>
            <ul className="list-unstyled">
              <li>
                <i className="fas fa-map-marker-alt me-2"></i>Ground Floor,
                Office No-52/ Plot No-44, Sai Chamber CHS, Wing A, Sector 11,
                Sai Chambers, CBD Belapur, Navi Mumbai, Thane, Maharashtra -
                400614, GSTN:27AAVFV4635R1ZY
              </li>
              <br />
              <li>
                <i className="fas fa-phone-alt me-2"></i>022-46030343
              </li>
              <li>
                <i className="fas fa-envelope me-2"></i>{" "}
                Info@rubberscrapmart.com
              </li>
            </ul>

            <div className="map-container mb-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.0781076452013!2d73.0372743742669!3d19.016279553846417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c33aedbd37ad%3A0x5e9915029446713f!2sSai%20Chambers!5e0!3m2!1sen!2sin!4v1741590949059!5m2!1sen!2sin" width="100%"
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
              <a
                href="https://www.facebook.com/profile.php?id=61574102936310"
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
              >
                <i className="fab fa-facebook fa-2x text-primary"></i>{" "}
                {/* Facebook - Blue */}
              </a>
              <a
                href="https://x.com/Rubberscrapmart"
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
              >
                <i className="fab fa-twitter fa-2x text-info"></i>{" "}
                {/* Twitter - Light Blue */}
              </a>
              <a
                href="https://www.instagram.com/rubberscrapmart/"
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
              >
                <i className="fab fa-instagram fa-2x text-danger"></i>{" "}
                {/* Instagram - Red */}
              </a>
              <a
                href="https://www.youtube.com/@Rubberscrapmart"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-youtube fa-2x text-danger"></i>{" "}
                {/* YouTube - Red */}
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
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    How can I get in touch with customer service?
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    You can reach us via the form above or by calling Tel: 022-46030343
                     during business hours.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Where are you located?
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Our office is located at Ground Floor,
                    Office No-52/ Plot No-44, Sai Chamber CHS, Wing A, Sector 11,
                    Sai Chambers, CBD Belapur, Navi Mumbai, Thane, Maharashtra -
                    400614,GSTN:27AAVFV4635R1ZY
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
