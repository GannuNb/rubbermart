import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function NavLinksRenderer({
  links,
  location,
  containerClass,
  linkClass,
  activeClass,
}) {
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth || {});

  const handleNavigation = (item) => {
    // CHECK ONLY FOR BUSINESS PROFILE REQUIRED LINKS
    if (item.requiresBusinessProfile) {
      // NOT LOGGED IN
      if (!token) {
        navigate("/login");
        return;
      }

      // BUSINESS PROFILE NOT COMPLETED
      if (!user?.businessProfileCompleted) {
        navigate("/business-profile");
        return;
      }
    }

    // ALLOWED
    navigate(item.path);
  };

  return (
    <div className={containerClass}>
      {links.map((item, index) => {
        const Icon = item.icon;

        const isActive = location.pathname === item.path;

        return (
          <div
            key={index}
            onClick={() => handleNavigation(item)}
            className={`${linkClass} ${isActive ? activeClass : ""}`}
            style={{ cursor: "pointer" }}
          >
            {Icon && <Icon size={18} />}

            <span className="link-label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default NavLinksRenderer;