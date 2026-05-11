import React from "react";

import {
  Link,
} from "react-router-dom";

function NavLinksRenderer({

  links,

  location,

  containerClass,

  linkClass,

  activeClass,

}) {

  return (

    <div className={containerClass}>

      {links.map(
        (item, index) => {

          const Icon =
            item.icon;

          return (

            <Link
              key={index}
              to={item.path}
              className={`${linkClass} ${
                location.pathname ===
                item.path

                  ? activeClass

                  : ""
              }`}
            >

              <Icon />

              <span>
                {item.label}
              </span>

            </Link>
          );
        }
      )}

    </div>
  );
}

export default NavLinksRenderer;