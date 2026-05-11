import React from "react";

import {
  FaUserCircle,
} from "react-icons/fa";

import styles from "../../styles/Navbar/RoleNavbar.module.css";

function UserProfileCard({
  user,
}) {

  return (

    <div
      className={
        styles.profileWrapper
      }
    >

      <button
        className={
          styles.profileBtn
        }
      >

        <div
          className={
            styles.userAvatar
          }
        >
          <FaUserCircle />
        </div>

        <div
          className={
            styles.userInfo
          }
        >

          <h4>
            Hi,{" "}
            {
              user?.name?.split(
                " "
              )[0]
            }
          </h4>

          <span>
            {user.role}
          </span>

        </div>

      </button>

    </div>
  );
}

export default UserProfileCard;