import { Leaf, Clock, Users } from "lucide-react";
import { darkLayer } from "../theme";
import FoodImage from "./FoodImage";

const points = [
  { icon: <Leaf size={26} />, title: "Fresh Ingredients", text: "Made fresh every day" },
  { icon: <Clock size={26} />, title: "Quick Service", text: "Hot food, served fast" },
  { icon: <Users size={26} />, title: "Family Friendly", text: "A place for everyone" }
];

function About() {
  return (
    <div id="about" style={{ backgroundColor: darkLayer }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(28px, 5vw, 60px)",
          padding: "var(--section-y) var(--pad)",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <FoodImage
          src="/images/about.jpg"
          alt="About DineNow"
          style={{
            flex: "1 1 280px",
            maxWidth: "420px",
            width: "100%",
            height: "clamp(240px, 60vw, 380px)",
            borderRadius: "12px",
            border: "2px solid #d4a574"
          }}
        />

        <div style={{ flex: "1 1 300px", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
          <p style={{ color: "#d4a574", letterSpacing: "3px" }}>ABOUT US</p>
          <h2 style={{ fontSize: "clamp(26px, 6vw, 36px)", margin: "10px 0 20px" }}>
            Welcome to DineNow
          </h2>
          <p style={{ color: "#eee", lineHeight: "1.8", marginBottom: "30px" }}>
            DineNow serves fast food, Chinese, cafe favourites, traditional
            Indian dishes and desserts, all under one roof. Every dish is made
            with fresh ingredients and a lot of care.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {points.map((p) => (
              <div key={p.title} style={{ color: "#d4a574", flex: "1 1 130px" }}>
                {p.icon}
                <h4 style={{ color: "white", margin: "8px 0 2px" }}>{p.title}</h4>
                <p style={{ color: "#ddd", fontSize: "14px" }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;