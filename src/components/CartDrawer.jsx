import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, CheckCircle, ArrowLeft, MessageCircle } from "lucide-react";
import FoodImage from "./FoodImage";
import Confetti from "./Confetti";
import OrderTracker from "./OrderTracker";
import { useCart } from "../context/CartContext";
import { saveOrder } from "../orders";
import { rememberOrder } from "../myOrders";
import { RESTAURANT_WHATSAPP, RESTAURANT_NAME, RESTAURANT_UPI } from "../config";

const orderTypes = ["Dine-in", "Takeaway", "Delivery"];

const emptyForm = () => ({
  name: "",
  phone: "",
  address: "",
  type: "Dine-in",
  table: "",
  payment: "Cash",
  notes: ""
});

// Readable payment name for the chosen order type
const paymentLabel = (payment, type) =>
  payment === "Cash" ? (type === "Delivery" ? "Cash on Delivery" : "Pay by Cash") : "UPI";

function buildMessage(order) {
  const lines = [
    `*New Order ${order.number}* - ${RESTAURANT_NAME}`,
    "",
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    `Type: ${order.type}`
  ];
  if (order.type === "Delivery") lines.push(`Address: ${order.address}`);
  if (order.type === "Dine-in" && order.table) lines.push(`Table: ${order.table}`);
  lines.push(`Payment: ${order.payment}`, "", "*Items*");
  order.items.forEach((i) => lines.push(`${i.qty} x ${i.name} - Rs.${i.qty * i.price}`));
  lines.push("", `*Total: Rs.${order.total}*`);
  if (order.notes) lines.push("", `Notes: ${order.notes}`);
  return lines.join("\n");
}

function whatsappUrl(order) {
  return `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(buildMessage(order))}`;
}

function CartDrawer() {
  const navigate = useNavigate();
  const { list, total, addItem, removeItem, clearCart, cartOpen, setCartOpen } = useCart();

  const [view, setView] = useState("cart"); // cart | checkout | payment | done
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!cartOpen) return null;

  function close() {
    setCartOpen(false);
    if (view === "done") {
      setView("cart");
      setOrder(null);
    }
  }

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "", form: "" }));
  }

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit phone number";
    if (form.type === "Delivery" && form.address.trim().length < 8)
      e.address = "Please enter your full delivery address";
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

    const data = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      type: form.type,
      address: form.address.trim(),
      table: form.table.trim(),
      payment: paymentLabel(form.payment, form.type),
      notes: form.notes.trim(),
      items: list.map(({ food, qty }) => ({ name: food.name, price: food.priceNum, qty })),
      total,
      etaMinutes: form.type === "Delivery" ? 40 : 25
    };

    try {
      const { id, number } = await saveOrder(data);
      const newOrder = { ...data, id, number, placedAt: Date.now() };

      // Remember it on this device for the My Orders page
      rememberOrder({
        id,
        number,
        name: newOrder.name,
        type: newOrder.type,
        items: newOrder.items,
        total: newOrder.total,
        etaMinutes: newOrder.etaMinutes,
        placedAt: newOrder.placedAt
      });

      window.open(whatsappUrl(newOrder), "_blank");
      setOrder(newOrder);
      clearCart();

      setForm(emptyForm());
      setErrors({});
      setView("done");
    } catch (err) {
      console.error("Order failed:", err);
      setErrors({ form: "Could not place the order. Check your internet and try again." });
    }

    setSaving(false);
  }

  const smallBtn = {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    border: "1px solid #d4a574",
    backgroundColor: "transparent",
    color: "#d4a574",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: `1px solid ${hasError ? "#e74c3c" : "#555"}`,
    backgroundColor: "#222",
    color: "white",
    fontSize: "15px"
  });

  const label = { display: "block", fontSize: "13px", color: "#d4a574", margin: "14px 0 6px" };
  const errorText = { color: "#e74c3c", fontSize: "13px", marginTop: "4px" };

  const choiceBtn = (active) => ({
    flex: 1,
    padding: "9px 6px",
    borderRadius: "8px",
    border: "1px solid #d4a574",
    backgroundColor: active ? "#d4a574" : "transparent",
    color: active ? "#111" : "#d4a574",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: active ? "bold" : "normal"
  });

  const goldBtn = {
    width: "100%",
    backgroundColor: "#d4a574",
    color: "#111",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  const title =
    view === "cart"
      ? "Your Order"
      : view === "checkout"
      ? "Checkout"
      : view === "payment"
      ? "Payment"
      : "Order Confirmed";

  return (
    <div
      onClick={close}
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
      {view === "done" && <Confetti />}

      <div
        className="slide-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#1a1a1a",
          borderLeft: "1px solid rgba(212,165,116,0.5)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {(view === "checkout" || view === "payment") && (
              <ArrowLeft
                size={22}
                color="#d4a574"
                style={{ cursor: "pointer" }}
                onClick={() => setView(view === "payment" ? "checkout" : "cart")}
              />
            )}
            <h2 style={{ fontSize: "26px" }}>{title}</h2>
          </div>
          <X size={26} color="#d4a574" style={{ cursor: "pointer" }} onClick={close} />
        </div>

        {/* ---------- VIEW 1: CART ---------- */}
        {view === "cart" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
              {list.length === 0 && (
                <p style={{ color: "#aaa", textAlign: "center", marginTop: "60px" }}>
                  Your cart is empty.
                </p>
              )}

              {list.map(({ food, qty }) => (
                <div
                  key={food.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 0",
                    borderBottom: "1px solid #333"
                  }}
                >
                  <FoodImage
                    src={food.image}
                    alt={food.name}
                    style={{ width: "60px", height: "60px", borderRadius: "8px", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div>{food.name}</div>
                    <small style={{ color: "#d4a574" }}>₹{food.priceNum * qty}</small>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button style={smallBtn} onClick={() => removeItem(food.id)}>
                      <Minus size={14} />
                    </button>
                    <span>{qty}</span>
                    <button style={smallBtn} onClick={() => addItem(food)}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {list.length > 0 && (
              <div style={{ padding: "20px", borderTop: "1px solid #333" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "20px",
                    marginBottom: "15px"
                  }}
                >
                  <span>Total</span>
                  <b style={{ color: "#d4a574" }}>₹{total}</b>
                </div>
                <button style={goldBtn} onClick={() => setView("checkout")}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* ---------- VIEW 2: CHECKOUT (details) ---------- */}
        {view === "checkout" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
              <label style={{ ...label, marginTop: 0 }}>Order type</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {orderTypes.map((t) => (
                  <button key={t} style={choiceBtn(form.type === t)} onClick={() => setField("type", t)}>
                    {t}
                  </button>
                ))}
              </div>

              <label style={label}>Name</label>
              <input
                style={inputStyle(errors.name)}
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Your name"
              />
              {errors.name && <p style={errorText}>{errors.name}</p>}

              <label style={label}>Phone number</label>
              <input
                style={inputStyle(errors.phone)}
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
                inputMode="numeric"
              />
              {errors.phone && <p style={errorText}>{errors.phone}</p>}

              {form.type === "Delivery" && (
                <>
                  <label style={label}>Delivery address</label>
                  <textarea
                    style={{ ...inputStyle(errors.address), minHeight: "80px", resize: "vertical" }}
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="House no, street, area, landmark"
                  />
                  {errors.address && <p style={errorText}>{errors.address}</p>}
                </>
              )}

              {form.type === "Dine-in" && (
                <>
                  <label style={label}>Table number (optional)</label>
                  <input
                    style={inputStyle(false)}
                    value={form.table}
                    onChange={(e) => setField("table", e.target.value)}
                    placeholder="e.g. 5"
                  />
                </>
              )}

              <label style={label}>Notes (optional)</label>
              <input
                style={inputStyle(false)}
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Less spicy, no onion..."
              />

              <div
                style={{
                  marginTop: "22px",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "1px solid #333",
                  backgroundColor: "#222"
                }}
              >
                <h4 style={{ color: "#d4a574", marginBottom: "8px", letterSpacing: "1px" }}>
                  ORDER SUMMARY
                </h4>
                {list.map(({ food, qty }) => (
                  <div
                    key={food.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                      padding: "3px 0"
                    }}
                  >
                    <span>
                      {qty} x {food.name}
                    </span>
                    <span>₹{food.priceNum * qty}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "20px", borderTop: "1px solid #333" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "20px",
                  marginBottom: "15px"
                }}
              >
                <span>Total</span>
                <b style={{ color: "#d4a574" }}>₹{total}</b>
              </div>

              <button style={goldBtn} onClick={goToPayment}>
                Continue to payment
              </button>
            </div>
          </>
        )}

        {/* ---------- VIEW 3: PAYMENT ---------- */}
        {view === "payment" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
              <p style={{ color: "#aaa", marginBottom: "16px" }}>
                Total <b style={{ color: "#d4a574" }}>₹{total}</b>
              </p>

              {["Cash", "UPI"].map((p) => {
                const active = form.payment === p;
                return (
                  <div
                    key={p}
                    onClick={() => setField("payment", p)}
                    style={{
                      padding: "14px",
                      marginBottom: "12px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      border: `2px solid ${active ? "#d4a574" : "#333"}`,
                      backgroundColor: active ? "rgba(212,165,116,0.1)" : "transparent",
                      color: active ? "#d4a574" : "#ccc"
                    }}
                  >
                    <b>{paymentLabel(p, form.type)}</b>
                  </div>
                );
              })}

              {form.payment === "UPI" && (
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    backgroundColor: "#222",
                    textAlign: "center"
                  }}
                >
                  <p style={{ color: "#aaa", fontSize: "13px" }}>Pay ₹{total} to this UPI ID</p>
                  <p style={{ color: "#d4a574", fontSize: "20px", fontWeight: "bold", margin: "6px 0" }}>
                    {RESTAURANT_UPI}
                  </p>
                  <a
                    href={`upi://pay?pa=${RESTAURANT_UPI}&pn=${encodeURIComponent(RESTAURANT_NAME)}&am=${total}&cu=INR`}
                    style={{ color: "#2ecc71", fontSize: "14px" }}
                  >
                    Open my UPI app
                  </a>
                  <p style={{ color: "#888", fontSize: "12px", marginTop: "8px" }}>
                    After paying, press Confirm Order.
                  </p>
                  <p style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
                    Demo site: no real payment is taken.
                  </p>
                </div>
              )}
            </div>

            <div style={{ padding: "20px", borderTop: "1px solid #333" }}>
              {errors.form && <p style={{ ...errorText, marginBottom: "10px" }}>{errors.form}</p>}
              <button style={{ ...goldBtn, opacity: saving ? 0.7 : 1 }} onClick={placeOrder}>
                {saving ? "Placing..." : "Confirm Order"}
              </button>
            </div>
          </>
        )}

        {/* ---------- VIEW 4: CONFIRMATION + TRACKER ---------- */}
        {view === "done" && order && (
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px 20px", textAlign: "center" }}>
            <div className="check-pop" style={{ color: "#7ddc8a" }}>
              <CheckCircle size={60} />
            </div>
            <h3 style={{ margin: "10px 0 4px", fontSize: "24px" }}>Thank you, {order.name}!</h3>
            <p style={{ color: "#aaa", marginBottom: "14px" }}>Your order has been placed.</p>

            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid rgba(212,165,116,0.5)",
                marginBottom: "14px"
              }}
            >
              <p style={{ color: "#aaa", fontSize: "13px" }}>ORDER NUMBER</p>
              <p style={{ color: "#d4a574", fontSize: "26px", fontWeight: "bold" }}>{order.number}</p>
            </div>

            <OrderTracker order={order} />

            <div style={{ textAlign: "left", marginBottom: "16px" }}>
              {order.items.map((i) => (
                <div
                  key={i.name}
                  style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}
                >
                  <span>
                    {i.qty} x {i.name}
                  </span>
                  <span>₹{i.qty * i.price}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #333",
                  marginTop: "8px",
                  paddingTop: "8px",
                  fontWeight: "bold"
                }}
              >
                <span>Total ({order.payment})</span>
                <span style={{ color: "#d4a574" }}>₹{order.total}</span>
              </div>
            </div>

            <a
              href={whatsappUrl(order)}
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
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "16px" }}>
              Your order is already saved with the restaurant.
            </p>

            <button
              onClick={() => {
                close();
                navigate("/orders");
              }}
              style={{ ...goldBtn, marginBottom: "10px" }}
            >
              Track my order
            </button>

            <button
              onClick={close}
              style={{ ...goldBtn, backgroundColor: "transparent", color: "#d4a574", border: "1px solid #d4a574" }}
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;