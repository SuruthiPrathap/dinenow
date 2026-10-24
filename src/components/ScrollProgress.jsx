import { useEffect, useRef } from "react";

function ScrollProgress() {
  const bar = useRef(null);

  useEffect(() => {
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (bar.current) bar.current.style.width = percent + "%";
    }
    window.addEventListener("scroll", update);
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <div ref={bar} className="scroll-progress" />;
}

export default ScrollProgress;