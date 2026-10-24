import { Award, ChefHat, Star } from "lucide-react";
import { darkLayer } from "../theme";
import FoodImage from "./FoodImage";

const stats = [
  { icon: <ChefHat size={28} />, number: "15+", label: "Years Experience" },
  { icon: <Award size={28} />, number: "12", label: "Awards Won" },
  { icon: <Star size={28} />, number: "4.9", label: "Guest Rating" }
];

function Chef() {
  return (
    <div style={{ backgroundColor: darkLayer }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "clamp(28px, 5vw, 60px)",
          padding: "var(--section-y) var(--pad)",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <FoodImage
          src="/images/chef5.jpg"
          alt="Our head chef"
          style={{
            flex: "1 1 300px",
            width: "100%",
            height: "clamp(280px, 70vw, 420px)",
            borderRadius: "10px",
            border: "3px solid #d4a574"
          }}
        />

        <div style={{ flex: "1 1 300px" }}>
          <p style={{ color: "#d4a574", letterSpacing: "2px" }}>MEET OUR CHEF</p>
          <h2 style={{ fontSize: "clamp(26px, 6vw, 36px)", margin: "10px 0 20px" }}>
            Award Winning Chef
          </h2>
          <p style={{ color: "#ddd", lineHeight: "1.8", marginBottom: "30px" }}>
            Our head chef brings over fifteen years of experience, mixing
            traditional recipes with fresh seasonal ingredients to create dishes
            you will remember.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px, 5vw, 40px)" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ color: "#d4a574" }}>
                {s.icon}
                <h3 style={{ color: "white", margin: "8px 0 2px" }}>{s.number}</h3>
                <p style={{ color: "#ddd", fontSize: "14px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chef;