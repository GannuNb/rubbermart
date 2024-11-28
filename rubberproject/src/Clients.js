import React from "react";
import { useInView } from "react-intersection-observer";
import { FaThumbsUp, FaRecycle, FaIndustry } from "react-icons/fa"; // Updated React Icons
import CountUp from "react-countup";
import "./NumberWidget.scss"; // Custom styles if needed

const HappyClients = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <>
      <div className="wid">
        <div
          ref={ref}
          className="container my-5 mb-0"
          style={{ background: "linear-gradient(90deg, #00c6ff, #0072ff)", padding: 50 }}
        >
          <div className="row text-center">
            {/* First Box */}
            <div className="col-md-4">
              <div className="p-3 stat-box" style={{ backgroundColor: "#ffff" }}>
                <div className="icon mb-2">
                  <FaThumbsUp style={{ fontSize: "50px" }} />
                </div>
                <h2>{inView && <CountUp start={0} end={97} duration={2} />}%</h2>
                <h6 style={{ color: "black", fontFamily: "system-ui" }}>
                  Of our customers are satisfied with our scrap recycling services
                </h6>
              </div>
            </div>

            {/* Second Box */}
            <div className="col-md-4">
              <div className="p-3 stat-box" style={{ backgroundColor: "#ffff" }}>
                <div className="icon mb-2">
                  <FaRecycle style={{ fontSize: "50px" }} />
                </div>
                <h2>
                  {inView && <CountUp start={0} end={1000} duration={3} separator="," />}
                  +
                </h2>
                <h6 style={{ color: "black", fontFamily: "system-ui" }}>
                  Scrap items successfully recycled by our team
                </h6>
              </div>
            </div>

            {/* Third Box */}
            <div className="col-md-4">
              <div className="p-3 stat-box" style={{ backgroundColor: "#ffff" }}>
                <div className="icon mb-2">
                  <FaIndustry style={{ fontSize: "50px" }} />
                </div>
                <h2>{inView && <CountUp start={0} end={20} duration={3} />}+</h2>
                <h6 style={{ color: "black", fontFamily: "system-ui" }}>
                  Years of experience in the scrap recycling industry
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HappyClients;
