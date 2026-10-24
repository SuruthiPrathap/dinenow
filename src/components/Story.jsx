import FoodImage from "./FoodImage";
import { darkLayer } from "../theme";

function Story() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "60px",
      padding: "80px 60px",
     backgroundColor: "rgba(10,10,10,0)"
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#d4a574", letterSpacing: "2px" }}>OUR STORY</p>
        <h2 style={{ fontSize: "36px", margin: "10px 0 20px" }}>
          Every Flavor Tells a Story
        </h2>
        <p style={{ color: "#aaa", lineHeight: "1.8" }}>
          At DineNow, every dish is made with fresh ingredients and a lot of
          love. Come hungry, leave happy.
        </p>
      </div>

      <FoodImage
        src="/images/flavour.jpg"
        alt="Our restaurant"
        style={{ flex: 1, height: "320px", borderRadius: "10px" }}
      />
    </div>
  );
}

export default Story;