import { useState } from "react";
import { Star } from "lucide-react";

function StarRating({ value = 0, onChange, size = 28 }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div style={{ display: "flex", gap: "4px" }} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          color="#f1c40f"
          fill={n <= shown ? "#f1c40f" : "none"}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
        />
      ))}
    </div>
  );
}

export default StarRating;