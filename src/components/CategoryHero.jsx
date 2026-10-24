import { useNavigate } from "react-router-dom";
import FoodImage from "./FoodImage";

function CategoryHero({ title, count, images = [] }) {
  const navigate = useNavigate();

  const background = images[0];
  const panels = images.slice(1, 3);

  const crumb = {
    color: "#ccc",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontSize: "14px",
    fontFamily: "inherit",
    padding: 0
  };

  return (
    <div style={{ position: "relative", minHeight: "clamp(210px, 40vw, 300px)", overflow: "hidden" }}>
      {background && (
        <FoodImage
          src={background}
          alt={title}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.4) 100%)"
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "1200px",
          minHeight: "inherit",
          margin: "0 auto",
          padding: "30px var(--pad)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "30px"
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p style={{ color: "#ccc", fontSize: "14px", marginBottom: "10px" }}>
            <button style={crumb} onClick={() => navigate("/")}>Home</button>
            {" / "}
            <button style={crumb} onClick={() => navigate("/", { state: { scrollTo: "menu" } })}>
              Menu
            </button>
            {" / "}
            <span style={{ color: "#d4a574" }}>{title}</span>
          </p>

          <h1
            style={{
              fontSize: "clamp(34px, 8vw, 52px)",
              lineHeight: "1.1",
              textShadow: "0 3px 15px rgba(0,0,0,0.8)"
            }}
          >
            {title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "15px 0" }}>
            <div style={{ width: "50px", height: "2px", backgroundColor: "#d4a574" }} />
            <div
              style={{
                width: "9px",
                height: "9px",
                backgroundColor: "#d4a574",
                transform: "rotate(45deg)"
              }}
            />
            <div style={{ width: "50px", height: "2px", backgroundColor: "#d4a574" }} />
          </div>

          <p style={{ color: "#ddd" }}>{count} dishes · Freshly made to order</p>
        </div>

        {panels.length > 0 && (
          <div className="hero-panels" style={{ display: "flex", gap: "15px", flexShrink: 0 }}>
            {panels.map((src, i) => (
              <div
                key={src}
                className="float"
                style={{
                  animationDelay: `${i * 1.2}s`,
                  width: "clamp(110px, 16vw, 170px)",
                  height: "clamp(150px, 22vw, 220px)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid rgba(212,165,116,0.6)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                }}
              >
                <FoodImage src={src} alt={title} style={{ width: "100%", height: "100%" }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryHero;