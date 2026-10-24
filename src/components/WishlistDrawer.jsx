import { useNavigate } from "react-router-dom";
import { X, Heart, Plus, Trash2 } from "lucide-react";
import { menuData } from "../data/menuData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import FoodImage from "./FoodImage";
import VegDot from "./VegDot";

const allDishes = Object.values(menuData).flatMap((c) =>
  c.items.map((i) => ({ ...i, categoryTitle: c.title, slug: c.slug }))
);

function WishlistDrawer() {
  const { ids, toggle, wishOpen, setWishOpen } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  if (!wishOpen) return null;

  const list = ids
    .map((id) => allDishes.find((d) => d.id === id))
    .filter(Boolean);

  function openDish(d) {
    setWishOpen(false);
    navigate(`/menu/${d.slug}`, { state: { openFood: d.id } });
  }

  return (
    <div
      onClick={() => setWishOpen(false)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 1100
      }}
    >
      <div
        className="slide-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#1a1a1a",
          borderLeft: "1px solid rgba(212,165,116,0.5)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px"
          }}
        >
          <h2 style={{ fontSize: "26px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Heart size={24} color="#d4a574" fill="#d4a574" /> Wishlist
          </h2>
          <X size={26} color="#d4a574" style={{ cursor: "pointer" }} onClick={() => setWishOpen(false)} />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
          {list.length === 0 && (
            <p style={{ color: "#aaa", textAlign: "center", marginTop: "60px", lineHeight: "1.7" }}>
              Your wishlist is empty.
              <br />
              Tap the heart on any dish to save it here.
            </p>
          )}

          {list.map((d) => (
            <div
              key={d.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 0",
                borderBottom: "1px solid #333"
              }}
            >
              <div
                onClick={() => openDish(d)}
                style={{
                  position: "relative",
                  width: "64px",
                  height: "64px",
                  flexShrink: 0,
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer"
                }}
              >
                <FoodImage src={d.image} alt={d.name} style={{ width: "100%", height: "100%" }} />
                <span style={{ position: "absolute", top: "4px", right: "4px" }}>
                  <VegDot veg={d.veg} />
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => openDish(d)}>
                <div style={{ fontWeight: "bold" }}>{d.name}</div>
                <small style={{ color: "#aaa" }}>{d.categoryTitle}</small>
                <div style={{ color: "#d4a574", fontWeight: "bold" }}>{d.price}</div>
              </div>

              <button
                onClick={() => addItem(d)}
                title="Add to cart"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#d4a574",
                  color: "#111",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Plus size={18} />
              </button>
              <Trash2
                size={18}
                color="#888"
                title="Remove"
                style={{ cursor: "pointer" }}
                onClick={() => toggle(d.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WishlistDrawer;