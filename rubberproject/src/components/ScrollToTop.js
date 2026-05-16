import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Standard window scroll reset wrapped in a setTimeout 
    // This handles pages that load content dynamically via Redux/API thunks
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // Forces immediate snap without smooth transition delays
      });

      // 2. Fallback for elements/dashboards using nested scroll containers
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.body) {
        document.body.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }, 0); // 0ms timeout pushes the scroll execution to the end of the call stack

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

export default ScrollToTop;