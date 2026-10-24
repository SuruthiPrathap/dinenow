import { useEffect, useState } from "react";

function CountUp({ end, suffix = "", duration = 1500 }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let start = null;
    let frame;

    function step(time) {
      if (start === null) start = time;
      const progress = Math.min((time - start) / duration, 1);
      setN(Math.floor(progress * end));
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

export default CountUp;