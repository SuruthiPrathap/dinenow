import { useState } from "react";
import { ImageOff } from "lucide-react";

function FoodImage({ src, alt, style, className }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={className}
        title={src}
        style={{
          ...style,
          backgroundColor: "#222",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          color: "#d4a574",
          overflow: "hidden",
          textAlign: "center"
        }}
      >
        <ImageOff size={24} />
        <span style={{ fontSize: "9px", color: "#888", padding: "0 4px", wordBreak: "break-all" }}>
          {src}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      style={{ ...style, objectFit: "cover" }}
    />
  );
}

export default FoodImage;