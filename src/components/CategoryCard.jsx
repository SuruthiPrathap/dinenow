import { Star, Plus, Minus, Heart } from "lucide-react";
import FoodImage from "./FoodImage";
import VegDot from "./VegDot";
import { useCart } from "../context/CartContext";
import { useRatings } from "../context/RatingContext";
import { useWishlist } from "../context/WishlistContext";

function CategoryCard({ food, onClick, index = 0, view = "grid" }) {
  const { items, addItem, removeItem } = useCart();
  const { getRating } = useRatings();
  const { has, toggle } = useWishlist();
  const inCart = items[food.id];
  const liked = has(food.id);
  const r = getRating(food.id);
  const showVeg = food.showVeg !== false;

  const roundBtn = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#111",
    color: "#d4a574",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const addControl = inCart ? (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "#d4a574",
        borderRadius: "30px",
        padding: "4px"
      }}
    >
      <button style={roundBtn} onClick={() => removeItem(food.id)}>
        <Minus size={15} />
      </button>
      <b style={{ color: "#111", minWidth: "16px", textAlign: "center" }}>{inCart.qty}</b>
      <button style={roundBtn} onClick={() => addItem(food)}>
        <Plus size={15} />
      </button>
    </div>
  ) : (
    <button
      onClick={(e) => {
        e.stopPropagation();
        addItem(food);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "#d4a574",
        color: "#111",
        border: "none",
        borderRadius: "30px",
        padding: "9px 20px",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      <Plus size={16} /> Add
    </button>
  );

  const heart = (top) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle(food.id);
      }}
      title={liked ? "Remove from wishlist" : "Add to wishlist"}
      style={{
        position: "absolute",
        top,
        right: "10px",
        zIndex: 3,
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        border: "none",
        backgroundColor: "rgba(0,0,0,0.6)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Heart size={17} color={liked ? "#e74c3c" : "#fff"} fill={liked ? "#e74c3c" : "none"} />
    </button>
  );

  const ratingRow = (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <Star size={15} color="#f1c40f" fill={r.avg ? "#f1c40f" : "none"} />
      <span style={{ fontSize: "14px", color: r.avg ? "white" : "#bbb" }}>
        {r.avg ? `${r.avg} (${r.count})` : "No ratings yet"}
      </span>
    </div>
  );

  const priceStyle = {
    color: "#d4a574",
    fontSize: "22px",
    fontWeight: "bold",
    fontFamily: "'Playfair Display', Georgia, serif"
  };

  const tagBadge = food.tag && (
    <span
      style={{
        position: "absolute",
        top: "12px",
        left: "12px",
        backgroundColor: "#d4a574",
        color: "#111",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "4px 10px",
        borderRadius: "20px",
        zIndex: 2
      }}
    >
      {food.tag}
    </span>
  );

  const vegBadge = showVeg && (
    <span style={{ position: "absolute", top: "14px", right: "14px", zIndex: 2 }}>
      <VegDot veg={food.veg} />
    </span>
  );

  const animation = { animationDelay: `${Math.min(index, 12) * 60}ms` };

  /* ---------- LIST VIEW ---------- */
  if (view === "list") {
    return (
      <div
        className="food-card fade-up list-card"
        onClick={onClick}
        style={{
          ...animation,
          display: "flex",
          backgroundColor: "rgba(30,30,30,0.8)",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: "pointer",
          border: "1px solid rgba(212,165,116,0.25)"
        }}
      >
        <div
          className="list-photo"
          style={{
            position: "relative",
            width: "170px",
            minHeight: "170px",
            flexShrink: 0,
            overflow: "hidden"
          }}
        >
          <FoodImage
            className="card-img"
            src={food.image}
            alt={food.name}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          />
          {tagBadge}
          {heart("10px")}
        </div>

        <div
          style={{
            flex: 1,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "8px"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              {showVeg && <VegDot veg={food.veg} />}
              <h3 style={{ fontSize: "19px" }}>{food.name}</h3>
            </div>
            {ratingRow}
            <p
              style={{
                color: "#aaa",
                fontSize: "14px",
                lineHeight: "1.5",
                marginTop: "8px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical"
              }}
            >
              {food.desc}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={priceStyle}>{food.price}</span>
            {addControl}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- GRID VIEW ---------- */
  return (
    <div
      className="food-card fade-up"
      onClick={onClick}
      style={{
        ...animation,
        position: "relative",
        height: "340px",
        borderRadius: "18px",
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid rgba(212,165,116,0.35)"
      }}
    >
      <FoodImage
        className="card-img"
        src={food.image}
        alt={food.name}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />

      {tagBadge}
      {vegBadge}
      {heart(showVeg ? "42px" : "12px")}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "60px 16px 16px",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0) 100%)"
        }}
      >
        <h3 style={{ fontSize: "20px", marginBottom: "5px", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          {food.name}
        </h3>
        <div style={{ marginBottom: "12px" }}>{ratingRow}</div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={priceStyle}>{food.price}</span>
          {addControl}
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;