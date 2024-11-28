import React, { useState } from "react";
import "./ChatWidget.css"; // Add your styles here

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const whatsappUrl = `https://wa.me/9346481093?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };
  
  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-box">
          <h4>Chat with us</h4>
          <p>Hi, message us with any questions. We're happy to help!</p>
          <textarea
            placeholder="Write message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="send-button" onClick={handleSendMessage}>
            ➤
          </button>
          <div className="instant-answers">
            <p>Instant answers</p>
            <button
              onClick={() => setMessage("go to sell page and sell your scrap?")}
            >
              How do I sell ?
            </button>
            <button
              onClick={() => setMessage("It will take upto 4 days")}
            >
              How long will it take for an order to get delivered?
            </button>
          </div>
        </div>
      )}
      <button className="whatsapp-icon" onClick={toggleChatBox}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
        />
      </button>
    </div>
  );
};

export default ChatWidget;
