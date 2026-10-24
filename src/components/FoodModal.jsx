import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Minus, Plus, Star, ShoppingCart, Zap, ArrowLeft,
  CheckCircle, MessageCircle, Banknote, Smartphone
} from "lucide-react";
import FoodImage from "./FoodImage";
import VegDot from "./VegDot";
import StarRating from "./StarRating";
import Confetti from "./Confetti";
import OrderTracker from "./OrderTracker";
import { useCart } from "../context/CartContext";
import { useRatings } from "../context/RatingContext";
import { saveOrder } from "../orders";
import { rememberOrder } from "../myOrders";
import { RESTAURANT_WHATSAPP, RESTAURANT_NAME, RESTAURANT_UPI } from "../config";

const speeds = [
  { key: "express", label: "Express", time: "10 min", minutes: 10, extra: 30 },
  { key: "standard", label: "Standard", time: "30 min", minutes: 30, extra: 0 }
];

const emptyForm = () => ({ name: "", phone: "", city: "", address: "" });

function buildMessage(o) {
  return [
    `*New Order ${o.number}* - ${RESTAURANT_NAME}`,
    "",
    `Name: ${o.name}`,
    `Phone: ${o.phone}`,
    `City: ${o.city}`,
    `Address: ${o.address}`,
    `Delivery: ${o.speedLabel} (${o.speedTime})`,
    `Payment: ${o.payment}`,
    "",
    `${o.qty} x ${o.food} - Rs.${o.total}`
  ].join("\n");
}

function FoodModal({ food, onClose }) {
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [myStars, setMyStars] = useState(0);
  const [view, setView] = useState("details"); // details | checkout | payment | done
  const [speed, setSpeed] = useState("standard");
  const [payment, setPayment] = useState("Cash on Delivery");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  const { addItem, setCartOpen } = useCart();
  const { rate, getRating } = useRatings();
  const r = getRating(food.id);

  const showVeg = food.showVeg !== false;
  const hasIngredients = food.ingredients && food.ingredients.length > 0;
  const chosen = speeds.find((s) => s.key === speed);
  const orderTotal = food.priceNum * qty + chosen.extra;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "", form: "" }));
  }

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit phone number";
    if (form.city.trim().length < 2) e.city = "Please enter your city";
    if (form.address.trim().length < 8) e.address = "Please enter your full address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Step 2: details are valid, go to payment
  function goToPayment() {
    if (validate()) setView("payment");
  }

  // Step 3: save the order only after payment is chosen
  async function placeOrder() {
    if (saving) return;
    setSaving(true);

    try {
      const { id, number } = await saveOrder({
        name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        type: "Delivery",
        items: [{ name: food.name, price: food.priceNum, qty }],
        total: orderTotal,
        payment,
        speed: `${chosen.label} (${chosen.time})`,
        etaMinutes: chosen.minutes
      });

      const placedAt = Date.now();

      setOrder({
        id,
        number,
        name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        food: food.name,
        qty,
        total: orderTotal,
        payment,
        speedLabel: chosen.label,
        speedTime: chosen.time,
        type: "Delivery",
        placedAt,
        etaMinutes: chosen.minutes
      });

      // Remember it on this device for the My Orders page
      rememberOrder({
        id,
        number,
        name: form.name.trim(),
        type: "Delivery",
        items: [{ name: food.name, price: food.priceNum, qty }],
        total: orderTotal,
        etaMinutes: chosen.minutes,
        placedAt
      });

      setForm(emptyForm());
      setPayment("Cash on Delivery");
      setErrors({});
      setView("done");
    } catch (err) {
      console.error("Order failed:", err);
      setErrors({ form: "Could not place the order. Check your internet and try again." });
    }

    setSaving(false);
  }

  function handleAddToCart() {
    addItem(food, qty);
    onClose();
    setCartOpen(true);
  }

  const qtyBtn = {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "1px solid #d4a574",
    backgroundColor: "transparent",
    color: "#d4a574",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const input = (hasError) => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: `1px solid ${hasError ? "#e74c3c" : "#555"}`,
    backgroundColor: "#222",
    color: "white",
    fontSize: "15px"
  });
  const label = { display: "block", fontSize: "13px", color: "#d4a574", margin: "12px 0 5px" };
  const errorText = { color: "#e74c3c", fontSize: "13px", marginTop: "3px" };
  const goldBtn = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#d4a574",
    color: "#111",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  const paymentOptions = [
    { key: "Cash on Delivery", icon: <Banknote size={24} />, text: "Pay in cash when your food arrives" },
    { key: "UPI", icon: <Smartphone size={24} />, text: "Pay now with any UPI app" }
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
        zIndex: 1000
      }}
    >
      {view === "done" && <Confetti />}

      <div
        className="pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(18px, 4vw, 35px)",
          width: "100%",
          maxWidth: "950px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(212,165,116,0.5)",
          borderRadius: "18px",
          padding: "clamp(16px, 4vw, 30px)"
        }}
      >
        <X
          size={26}
          color="#d4a574"
          onClick={onClose}
          style={{ position: "absolute", top: "15px", right: "15px", cursor: "pointer", zIndex: 2 }}
        />

        <FoodImage
          src={food.image}
          alt={food.name}
          style={{
            width: "min(420px, 100%)",
            aspectRatio: "1 / 1",
            borderRadius: "12px",
            flexShrink: 0
          }}
        />

        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          {/* ================= DETAILS ================= */}
          {view === "details" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                {showVeg && <VegDot veg={food.veg} />}
                <Star size={16} color="#f1c40f" fill={r.avg ? "#f1c40f" : "none"} />
                <span>{r.avg ? `${r.avg} (${r.count})` : "No ratings yet"}</span>
                {food.tag && (
                  <span
                    style={{
                      backgroundColor: "#d4a574",
                      color: "#111",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "3px 10px",
                      borderRadius: "20px"
                    }}
                  >
                    {food.tag}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: "clamp(26px, 6vw, 34px)", marginBottom: "8px" }}>{food.name}</h2>
              <p style={{ color: "#d4a574", fontSize: "28px", marginBottom: "15px" }}>{food.price}</p>

              <p style={{ color: "#ccc", lineHeight: "1.7", marginBottom: "20px" }}>
                {food.desc || "Freshly prepared to order with quality ingredients."}
              </p>

              <h4 style={{ color: "#d4a574", letterSpacing: "2px", marginBottom: "10px" }}>
                INGREDIENTS
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "22px" }}>
                {hasIngredients ? (
                  food.ingredients.map((ing) => (
                    <span
                      key={ing}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: "1px solid rgba(212,165,116,0.5)",
                        fontSize: "14px"
                      }}
                    >
                      {ing}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#aaa" }}>Fresh ingredients, made to order.</span>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ color: "#d4a574", letterSpacing: "2px", marginBottom: "8px" }}>
                  RATE THIS DISH
                </h4>
                <StarRating
                  value={myStars}
                  onChange={(n) => {
                    if (myStars) return;
                    setMyStars(n);
                    rate(food.id, n);
                  }}
                />
                {myStars > 0 && (
                  <p style={{ color: "#7ddc8a", fontSize: "14px", marginTop: "6px" }}>
                    Thanks! You rated this {myStars} out of 5.
                  </p>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "18px" }}>
                <button style={qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus size={16} />
                </button>
                <span style={{ fontSize: "20px", minWidth: "25px", textAlign: "center" }}>{qty}</span>
                <button style={qtyBtn} onClick={() => setQty(qty + 1)}>
                  <Plus size={16} />
                </button>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setView("checkout")}
                  style={{ ...goldBtn, flex: "1 1 200px", fontSize: "17px" }}
                >
                  <Zap size={20} /> Order Now · ₹{food.priceNum * qty}
                </button>
                <button
                  onClick={handleAddToCart}
                  style={{
                    ...goldBtn,
                    flex: "1 1 160px",
                    fontSize: "16px",
                    backgroundColor: "transparent",
                    color: "#d4a574",
                    border: "1px solid #d4a574"
                  }}
                >
                  <ShoppingCart size={20} /> Add to Cart
                </button>
              </div>
            </>
          )}

          {/* ================= CHECKOUT (details) ================= */}
          {view === "checkout" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <ArrowLeft
                  size={22}
                  color="#d4a574"
                  style={{ cursor: "pointer" }}
                  onClick={() => setView("details")}
                />
                <h2 style={{ fontSize: "28px" }}>Delivery details</h2>
              </div>
              <p style={{ color: "#aaa" }}>
                {qty} x {food.name}
              </p>

              <label style={label}>Name</label>
              <input
                style={input(errors.name)}
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Your name"
              />
              {errors.name && <p style={errorText}>{errors.name}</p>}

              <label style={label}>Phone number</label>
              <input
                style={input(errors.phone)}
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
                inputMode="numeric"
              />
              {errors.phone && <p style={errorText}>{errors.phone}</p>}

              <label style={label}>City</label>
              <input
                style={input(errors.city)}
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="e.g. Chennai"
              />
              {errors.city && <p style={errorText}>{errors.city}</p>}

              <label style={label}>Full address</label>
              <textarea
                style={{ ...input(errors.address), minHeight: "70px", resize: "vertical" }}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="House no, street, area, landmark"
              />
              {errors.address && <p style={errorText}>{errors.address}</p>}

              <label style={label}>Delivery speed</label>
              <div style={{ display: "flex", gap: "10px" }}>
                {speeds.map((s) => {
                  const active = speed === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSpeed(s.key)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid #d4a574",
                        backgroundColor: active ? "#d4a574" : "transparent",
                        color: active ? "#111" : "#d4a574",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <b>{s.label}</b>
                      <div style={{ fontSize: "13px" }}>
                        {s.time} {s.extra ? `(+₹${s.extra})` : "(free)"}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "20px",
                  margin: "20px 0 14px"
                }}
              >
                <span>Total</span>
                <b style={{ color: "#d4a574" }}>₹{orderTotal}</b>
              </div>

              <button style={goldBtn} onClick={goToPayment}>
                Continue to payment
              </button>
            </>
          )}

          {/* ================= PAYMENT ================= */}
          {view === "payment" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <ArrowLeft
                  size={22}
                  color="#d4a574"
                  style={{ cursor: "pointer" }}
                  onClick={() => setView("checkout")}
                />
                <h2 style={{ fontSize: "28px" }}>Payment</h2>
              </div>
              <p style={{ color: "#aaa", marginBottom: "16px" }}>
                {qty} x {food.name} · Total <b style={{ color: "#d4a574" }}>₹{orderTotal}</b>
              </p>

              {paymentOptions.map((p) => {
                const active = payment === p.key;
                return (
                  <div
                    key={p.key}
                    onClick={() => setPayment(p.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px",
                      marginBottom: "12px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      border: `2px solid ${active ? "#d4a574" : "#333"}`,
                      backgroundColor: active ? "rgba(212,165,116,0.1)" : "transparent",
                      color: active ? "#d4a574" : "#ccc"
                    }}
                  >
                    {p.icon}
                    <div>
                      <b>{p.key}</b>
                      <div style={{ fontSize: "13px", color: "#aaa" }}>{p.text}</div>
                    </div>
                  </div>
                );
              })}

              {payment === "UPI" && (
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    backgroundColor: "#222",
                    marginBottom: "14px",
                    textAlign: "center"
                  }}
                >
                  <p style={{ color: "#aaa", fontSize: "13px" }}>Pay ₹{orderTotal} to this UPI ID</p>
                  <p style={{ color: "#d4a574", fontSize: "20px", fontWeight: "bold", margin: "6px 0" }}>
                    {RESTAURANT_UPI}
                  </p>
                  <a
                    href={`upi://pay?pa=${RESTAURANT_UPI}&pn=${encodeURIComponent(RESTAURANT_NAME)}&am=${orderTotal}&cu=INR`}
                    style={{ color: "#2ecc71", fontSize: "14px" }}
                  >
                    Open my UPI app
                  </a>
                  <p style={{ color: "#888", fontSize: "12px", marginTop: "8px" }}>
                    After paying, press Confirm Order below.
                  </p>
                  <p style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
                    Demo site: no real payment is taken.
                  </p>
                </div>
              )}

              {errors.form && <p style={{ ...errorText, marginBottom: "10px" }}>{errors.form}</p>}

              <button style={{ ...goldBtn, opacity: saving ? 0.7 : 1 }} onClick={placeOrder}>
                {saving ? "Placing..." : "Confirm Order"}
              </button>
            </>
          )}

          {/* ================= CONFIRMED + TRACKER ================= */}
          {view === "done" && order && (
            <div style={{ textAlign: "center", paddingTop: "10px" }}>
              <div className="check-pop" style={{ color: "#2ecc71" }}>
                <CheckCircle size={72} />
              </div>
              <h2 style={{ fontSize: "30px", margin: "10px 0 4px" }}>Order confirmed!</h2>
              <p style={{ color: "#aaa", marginBottom: "16px" }}>Thank you, {order.name}.</p>

              <div
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(212,165,116,0.5)",
                  marginBottom: "14px"
                }}
              >
                <p style={{ color: "#aaa", fontSize: "13px" }}>ORDER NUMBER</p>
                <p style={{ color: "#d4a574", fontSize: "26px", fontWeight: "bold" }}>
                  {order.number}
                </p>
              </div>

              <OrderTracker order={order} />

              <div style={{ textAlign: "left", color: "#ccc", fontSize: "15px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                  <span>{order.qty} x {order.food}</span>
                  <span>₹{order.total}</span>
                </div>
                <div style={{ color: "#aaa", fontSize: "14px", marginTop: "6px" }}>
                  Delivering to: {order.address}, {order.city}
                </div>
                <div style={{ color: "#aaa", fontSize: "14px" }}>Phone: {order.phone}</div>
                <div style={{ color: "#aaa", fontSize: "14px" }}>Payment: {order.payment}</div>
              </div>

              <a
                href={`https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(buildMessage(order))}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#25D366",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: "bold",
                  marginBottom: "10px"
                }}
              >
                <MessageCircle size={20} /> Send order on WhatsApp (optional)
              </a>
              <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "14px" }}>
                Your order is already saved with the restaurant.
              </p>

              <button
                onClick={() => {
                  onClose();
                  navigate("/orders");
                }}
                style={{ ...goldBtn, marginBottom: "10px" }}
              >
                Track my order
              </button>

              <button
                onClick={onClose}
                style={{
                  ...goldBtn,
                  backgroundColor: "transparent",
                  color: "#d4a574",
                  border: "1px solid #d4a574"
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodModal;