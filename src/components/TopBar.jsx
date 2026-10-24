import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, ShoppingCart, ArrowLeft, Search, Heart, X } from "lucide-react";
import { menuData } from "../data/menuData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import FoodImage from "./FoodImage";
import VegDot from "./VegDot";

const allDishes = Object.values(menuData).flatMap((c) =>
  c.items.map((i) => ({ ...i, categoryTitle: c.title, slug: c.slug }))
);

const badge = {
  position: "absolute",
  top: "-8px",
  right: "-8px",
  minWidth: "22px",
  height: "22px",
  borderRadius: "11px",
  backgroundColor: "#d4a574",
  color: "#111",
  fontSize: "13px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const outlineBtn = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexShrink: 0,
  backgroundColor: "transparent",
  color: "#d4a574",
  border: "1px solid #d4a574",
  borderRadius: "8px",
  padding: "9px 12px",
  cursor: "pointer",
  fontSize: "15px"
};

function TopBar() {
  const { count, setCartOpen } = useCart();
  const { ids, setWishOpen } = useWishlist();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();
  const results = q
    ? allDishes.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 7)
    : [];

  function openDish(d) {
    setQuery("");
    navigate(`/menu/${d.slug}`, { state: { openFood: d.id } });
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "clamp(8px, 2vw, 20px)",
        padding: "14px var(--pad)",
        backgroundColor: "rgba(17,17,17,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(212,165,116,0.25)"
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#d4a574",
          textDecoration: "none",
          flexShrink: 0
        }}
      >
        <ArrowLeft size={20} />
        <UtensilsCrossed size={24} />
        <b className="hide-xs" style={{ fontSize: "20px" }}>DineNow</b>
      </Link>

      {/* Search box */}
      <div style={{ position: "relative", flex: 1, minWidth: 0, maxWidth: "460px", margin: "0 auto" }}>
        <Search size={18} color="#d4a574" style={{ position: "absolute", left: "14px", top: "11px" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any dish..."
          style={{
            width: "100%",
            padding: "10px 38px 10px 40px",
            borderRadius: "30px",
            border: "1px solid #555",
            backgroundColor: "rgba(34,34,34,0.9)",
            color: "white",
            fontSize: "15px"
          }}
        />
        {query && (
          <X
            size={16}
            color="#aaa"
            onClick={() => setQuery("")}
            style={{ position: "absolute", right: "14px", top: "12px", cursor: "pointer" }}
          />
        )}

        {q && (
          <div
            className="search-drop"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(212,165,116,0.5)",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 12px 30px rgba(0,0,0,0.6)"
            }}
          >
            {results.length === 0 && (
              <p style={{ padding: "14px", color: "#aaa", fontSize: "14px" }}>No dishes found.</p>
            )}
            {results.map((d) => (
              <div
                key={d.id}
                onClick={() => openDish(d)}
                className="pill"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #2a2a2a"
                }}
              >
                <FoodImage
                  src={d.image}
                  alt={d.name}
                  style={{ width: "44px", height: "44px", borderRadius: "8px", flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "15px" }}>{d.name}</div>
                  <small style={{ color: "#aaa" }}>{d.categoryTitle}</small>
                </div>
                <VegDot veg={d.veg} />
                <b style={{ color: "#d4a574" }}>{d.price}</b>
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={() => navigate("/orders")} style={outlineBtn} title="My Orders">
  <span className="hide-sm">My Orders</span><span className="hide-xs" style={{ display: "none" }} />
</button>

      {/* Wishlist */}
      <button onClick={() => setWishOpen(true)} style={outlineBtn} title="Wishlist">
        <Heart size={20} /> <span className="hide-sm">Wishlist</span>
        {ids.length > 0 && <span style={badge}>{ids.length}</span>}
      </button>

      {/* Cart */}
      <button onClick={() => setCartOpen(true)} style={outlineBtn} title="Cart">
        <ShoppingCart size={20} /> <span className="hide-sm">Cart</span>
        {count > 0 && <span style={badge}>{count}</span>}
      </button>
    </div>
  );
}

export default TopBar;