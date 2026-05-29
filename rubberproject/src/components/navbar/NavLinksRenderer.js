// src/components/navbar/NavLinksRenderer.js
import React from "react";
import { Link } from "react-router-dom";

function NavLinksRenderer({
  links,
  location,
  containerClass,
  linkClass,
  activeClass,
}) {
  return (
    <div className={containerClass}>
      {links.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={index}
            to={item.path}
            className={`${linkClass} ${isActive ? activeClass : ""}`}
          >
            {Icon && <Icon size={18} />}
            <span className="link-label">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default NavLinksRenderer;