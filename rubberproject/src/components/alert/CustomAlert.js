import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import { MdOutlineWarningAmber } from "react-icons/md";
import styles from "../../styles/Components/CustomAlert.module.css";
import Logo from "../../assests/AlertLogo.png"; // Update path if needed

function CustomAlert({
  type = "info",
  title,
  message,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <FiCheckCircle />,
    error: <FiAlertCircle />,
    warning: <MdOutlineWarningAmber />,
    info: <FiInfo />,
  };

  return (
    <div className={styles.alertOverlay}>
      <div className={`${styles.alert} ${styles[type]}`}>
        <div className={styles.progress}></div>

        {/* Logo */}
        <div className={styles.logoWrapper}>
          <img src={Logo} alt="Logo" className={styles.logo} />
        </div>

        {/* Alert Icon */}
        <div className={styles.iconWrapper}>
          {icons[type]}
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h4>{title}</h4>
          <p>{message}</p>
        </div>

        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose}>
          <IoClose />
        </button>
      </div>
    </div>
  );
}

export default CustomAlert;