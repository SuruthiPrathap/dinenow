import { useState } from "react";
import { Link } from "react-router-dom";
import { darkLayer } from "../theme";
import SectionTitle from "./SectionTitle";
import FoodImage from "./FoodImage";
import Reveal from "./Reveal";

const items = [
  { slug: "fastfood", image: "/images/fastfood.avif", name: "Fast Food" },
  { slug: "chinese", image: "/images/chinese.avif", name: "Chinese" },
  { slug: "cafe", image: "/images/espresso.avif", name: "Cafe" },
  { slug: "traditional", image: "/images/traditional.avif", name: "Traditional" },
  { slug: "desserts", image: "/images/desserts.avif", name: "Desserts" },
  { slug: "starters", image: "/images/starters.avif", name: "Starters" },
  { slug: "italian", image: "/images/italian.avif", name: "Italian" },
  { slug: "seafood", image: "/images/seafood.avif", name: "Seafood" },
  { slug: "tandoori", image: "/images/tandori.avif", name: "Tandoori" },
  { slug: "healthy", image: "/images/healthy.avif", name: "Healthy" },
  { slug: "kerala", image: "/images/kerala.avif", name: "Kerala Food" },
  { slug: "streetfood", image: "/images/street.avif", name: "Street Food" }
];

function TopNotch() {
  const [hovered, setHovered] = useState("");

  return (
    <div id="menu" style={{ padding: "var(--section-y) var(--pad)", backgroundColor: darkLayer }}>
      <Reveal direction="up">
        <SectionTitle small="WHAT WE SERVE" title="We Offer Top Notch" />
      </Reveal>

      <div className="cat-grid">
        {items.map((item, i) => (
          <Reveal key={item.slug} direction="zoom" delay={(i % 3) * 120}>
            <Link
              to={`/menu/${item.slug}`}
              onMouseEnter={() => setHovered(item.slug)}
              onMouseLeave={() => setHovered("")}
              style={{
                position: "relative",
                display: "block",
                height: "clamp(120px, 28vw, 200px)",
                borderRadius: "20px",
                overflow: "hidden",
                textDecoration: "none",
                color: "white",
                border: "1px solid rgba(212,165,116,0.35)",
                boxShadow:
                  hovered === item.slug
                    ? "0 14px 30px rgba(0,0,0,0.6)"
                    : "0 4px 12px rgba(0,0,0,0.3)",
                transform: hovered === item.slug ? "translateY(-8px)" : "translateY(0)",
                transition: "transform 0.35s ease, box-shadow 0.35s ease"
              }}
            >
              <FoodImage
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "100%",
                  transform: hovered === item.slug ? "scale(1.12)" : "scale(1)",
                  transition: "transform 0.5s ease"
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor:
                    hovered === item.slug ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.5)",
                  transition: "background-color 0.4s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 8px",
                  textAlign: "center"
                }}
              >
                <h3
                  style={{
                    fontSize: "clamp(17px, 4.5vw, 28px)",
                    textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                    transform: hovered === item.slug ? "scale(1.08)" : "scale(1)",
                    transition: "transform 0.35s ease"
                  }}
                >
                  {item.name}
                </h3>
                <div
                  style={{
                    height: "2px",
                    backgroundColor: "#d4a574",
                    marginTop: "8px",
                    width: hovered === item.slug ? "70px" : "0px",
                    transition: "width 0.35s ease"
                  }}
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default TopNotch;