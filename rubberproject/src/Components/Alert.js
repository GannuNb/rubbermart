import React, { useEffect, useState } from 'react';
import './Alert.css';

const Alert = ({ message, type, onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <><div className='setter'>
    visible && (
      <div className={`alert alert-${type} ${!visible ? 'fade-out' : ''}`}>
        {message}
        <button className="dismiss-btn" onClick={() => { setVisible(false); onClose && onClose(); }}>
          &times;
        </button>
      </div>
      
    )
    </div></>
  );
  
};

export default Alert;
