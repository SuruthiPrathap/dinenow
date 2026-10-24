import { useState, useEffect } from "react";
import { Clock, LayoutGrid, UtensilsCrossed, ChefHat } from "lucide-react";
import { darkLayer } from "../theme";
import { menuData } from "../data/menuData";
import FoodImage from "./FoodImage";
import CountUp from "./CountUp";

const panelImages = [
  { src: "/images/chef.jpg", alt: "Our head chef", delay: "0s" },
  { src: "/images/cafe.avif", alt: "Fresh coffee", delay: "1.2s" }
];

const totalDishes = Object.values(menuData).reduce((sum, c) => sum + c.items.length, 0);

const stats = [
  { icon: <LayoutGrid size={22} />, end: Object.keys(menuData).length, suffix: "", label: "Categories" },
  { icon: <UtensilsCrossed size={22} />, end: totalDishes, suffix: "+", label: "Dishes" },
  { icon: <ChefHat size={22} />, text: "24/7", label: "Service" }
];

const step = (n) => ({ animationDelay: `${n * 150}ms` });

function Hero() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const date = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short"
  });

  return (
    <div style={{ backgroundColor: darkLayer }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(28px, 5vw, 50px)",
          padding: "clamp(40px, 8vw, 80px) var(--pad)",
          minHeight: "min(70vh, 720px)",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {/* LEFT: text */}
        <div
          style={{
            flex: "1 1 min(420px, 100%)",
            maxWidth: "560px",
            textShadow: "0 2px 12px rgba(0,0,0,0.9)"
          }}
        >
          <div
            className="fade-up"
            style={{
              ...step(0),
              display: "inline-flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              padding: "8px 16px",
              borderRadius: "30px",
              border: "1px solid rgba(212,165,116,0.6)",
              color: "#d4a574",
              fontSize: "14px",
              marginBottom: "12px"
            }}
          >
            <span
              className="pulse-dot"
              style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2ecc71" }}
            />
            <b>Open 24 Hours</b>
            <span style={{ color: "#777" }}>|</span>
            <Clock size={16} />
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>
          </div>

          <p className="fade-up" style={{ ...step(1), color: "#ccc", fontSize: "14px", marginBottom: "14px" }}>
            {date}
          </p>

          <h1
            className="fade-up"
            style={{
              ...step(2),
              fontSize: "clamp(32px, 7vw, 52px)",
              lineHeight: "1.15",
              margin: "0 0 15px"
            }}
          >
            Flavors Inspired by the Seasons
          </h1>

          <p className="fade-up" style={{ ...step(3), color: "#eee", marginBottom: "30px" }}>
            Discover the best restaurant and cafe
          </p>

          <div
            className="fade-up"
            style={{ ...step(4), display: "flex", flexWrap: "wrap", gap: "clamp(20px, 5vw, 35px)" }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ color: "#d4a574" }}>
                {s.icon}
                <h3 style={{ color: "white", margin: "6px 0 0", fontSize: "24px" }}>
                  {s.text ? s.text : <CountUp end={s.end} suffix={s.suffix} />}
                </h3>
                <p style={{ color: "#ddd", fontSize: "14px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: 2 image panels that scale with the screen */}
        <div style={{ display: "flex", gap: "clamp(10px, 2vw, 15px)", flexShrink: 0 }}>
          {panelImages.map((item) => (
            <div
              key={item.alt}
              className="float"
              style={{
                animationDelay: item.delay,
                width: "clamp(125px, 38vw, 190px)",
                height: "clamp(250px, 76vw, 380px)",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(212,165,116,0.6)"
              }}
            >
              <FoodImage
                src={item.src}
                alt={item.alt}
                style={{ width: "100%", height: "100%", opacity: 0.75 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;