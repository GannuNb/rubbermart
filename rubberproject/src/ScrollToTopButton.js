import React from 'react';

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    // Debugging: Check if the function is triggered
    console.log('Scroll button clicked!');
    
    // Get the current scroll position
    let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    
    // Animate scroll with a smooth effect
    const scrollAnimation = () => {
      // Scroll step: Decrease the position by a larger value for faster scrolling
      if (scrollPosition > 0) {
        // Update the scroll position (increasing the decrement to speed up scrolling)
        scrollPosition -= 24;  // Change 30 to a higher value for even faster scrolling
        
        // Set the scroll position for both documentElement and body (for compatibility)
        document.documentElement.scrollTop = scrollPosition;
        document.body.scrollTop = scrollPosition;

        // Continue the animation if we're not at the top
        requestAnimationFrame(scrollAnimation);
      } else {
        // Stop when the top is reached
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    // Start the animation
    requestAnimationFrame(scrollAnimation);
  };

  return (
    <div className="scroll-to-top" onClick={scrollToTop}>
      ↑ {/* This is the arrow symbol */}
    </div>
  );
};

export default ScrollToTopButton;
