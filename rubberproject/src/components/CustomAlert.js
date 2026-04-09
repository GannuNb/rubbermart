import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import { MdOutlineWarningAmber } from "react-icons/md";
import styles from "../styles/CustomAlert.module.css";

function CustomAlert({
  type = "info",
  title,
  message,
  onClose,
  duration = 4000,
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
    <div className={`${styles.alert} ${styles[type]}`}>
      <div className={styles.progress}></div>

      <div className={styles.iconWrapper}>{icons[type]}</div>

      <div className={styles.content}>
        <h4>{title}</h4>
        <p>{message}</p>
      </div>

      <button className={styles.closeBtn} onClick={onClose}>
        <IoClose />
      </button>
    </div>
  );
}

export default CustomAlert;