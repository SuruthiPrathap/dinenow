import { ShoppingCart, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";

function FloatingCartBar() {
  const { count, total, cartOpen, setCartOpen } = useCart();

  if (count === 0 || cartOpen) return null;

  return (
    <button
      className="slide-up"
      onClick={() => setCartOpen(true)}
      style={{
        position: "fixed",
        bottom: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: "18px",
        backgroundColor: "#d4a574",
        color: "#111",
        border: "none",
        borderRadius: "40px",
        padding: "14px 28px",
        fontSize: "17px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 8px 25px rgba(0,0,0,0.5)"
      }}
    >
      <ShoppingCart size={20} />
      {count} {count === 1 ? "item" : "items"} · ₹{total}
      <span style={{ display: "flex", alignItems: "center" }}>
        View Cart <ChevronRight size={18} />
      </span>
    </button>
  );
}

export default FloatingCartBar;