import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ClipboardCheck, ChefHat, Bike, PackageCheck, XCircle } from "lucide-react";
import { db } from "../firebase";
import { autoStatus, placedTime } from "../tracking";

const CANCEL_WINDOW = 5 * 60000; // 5 minutes

const stages = [
  { key: "New", label: "Received", icon: <ClipboardCheck size={20} /> },
  { key: "Preparing", label: "Preparing", icon: <ChefHat size={20} /> },
  { key: "Out", label: "On the way", icon: <Bike size={20} /> },
  { key: "Delivered", label: "Delivered", icon: <PackageCheck size={20} /> }
];

function stageIndex(status) {
  if (status === "Delivered") return 3;
  if (status === "Out for delivery" || status === "Ready") return 2;
  if (status === "Preparing") return 1;
  return 0;
}

function OrderTracker({ order }) {
  const [now, setNow] = useState(Date.now());
  const [live, setLive] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Follow the order live
  useEffect(() => {
    if (!order.id) return;
    return onSnapshot(
      doc(db, "orders", order.id),
      (snap) => snap.exists() && setLive(snap.data()),
      () => {}
    );
  }, [order.id]);

  const data = { ...order, ...(live || {}) };
  const status = autoStatus(data, now);
  const placed = placedTime(data);

  const cancelled = status === "Cancelled";
  const delivered = status === "Delivered";
  const current = stageIndex(status);

  const cancelLeft = placed ? Math.max(0, placed + CANCEL_WINDOW - now) : 0;
  const canCancel = data.status === "New" && cancelLeft > 0 && !cancelled && !delivered;

  const minLeft = placed ? Math.ceil((placed + data.etaMinutes * 60000 - now) / 60000) : 0;

  // Customer can confirm once the order is on its way or past its ETA
  const canConfirm = !cancelled && !delivered && (current >= 2 || minLeft <= 0);

  async function cancelOrder() {
    if (!window.confirm("Cancel this order?")) return;
    setBusy(true);
    setError("");
    try {
      await updateDoc(doc(db, "orders", order.id), { status: "Cancelled" });
    } catch {
      setError("Sorry, this order can no longer be cancelled.");
    }
    setBusy(false);
  }

  async function confirmDelivered() {
    setBusy(true);
    setError("");
    try {
      await updateDoc(doc(db, "orders", order.id), { status: "Delivered" });
    } catch {
      setError("Could not confirm. Please try again.");
    }
    setBusy(false);
  }

  if (cancelled) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid rgba(231,76,60,0.6)",
          backgroundColor: "rgba(231,76,60,0.1)",
          color: "#e74c3c",
          marginBottom: "16px"
        }}
      >
        <XCircle size={22} /> <b>This order was cancelled</b>
      </div>
    );
  }

  const mm = String(Math.floor(cancelLeft / 60000));
  const ss = String(Math.floor((cancelLeft % 60000) / 1000)).padStart(2, "0");

  return (
    <div
      style={{
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid rgba(212,165,116,0.5)",
        marginBottom: "16px"
      }}
    >
      <p style={{ color: delivered ? "#2ecc71" : "#d4a574", fontWeight: "bold", marginBottom: "12px" }}>
        {delivered
          ? "Delivered. Enjoy your meal!"
          : minLeft > 0
          ? `Arriving in about ${minLeft} min`
          : "Arriving any moment"}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {stages.map((s, i) => {
          const active = i <= current;
          return (
            <div key={s.key} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  margin: "0 auto 6px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? "#d4a574" : "#2a2a2a",
                  color: active ? "#111" : "#777",
                  transition: "all 0.4s"
                }}
              >
                {s.icon}
              </div>
              <small style={{ color: active ? "white" : "#777" }}>{s.label}</small>
            </div>
          );
        })}
      </div>

      {canConfirm && (
        <div style={{ marginTop: "14px", textAlign: "center" }}>
          <button
            onClick={confirmDelivered}
            disabled={busy}
            style={{
              padding: "11px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2ecc71",
              color: "#111",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              opacity: busy ? 0.6 : 1
            }}
          >
            {busy ? "Saving..." : "I received my order"}
          </button>
        </div>
      )}

      {canCancel && (
        <div style={{ marginTop: "14px", textAlign: "center" }}>
          <button
            onClick={cancelOrder}
            disabled={busy}
            style={{
              padding: "9px 22px",
              borderRadius: "8px",
              border: "1px solid #e74c3c",
              background: "transparent",
              color: "#e74c3c",
              cursor: "pointer",
              fontSize: "15px",
              opacity: busy ? 0.6 : 1
            }}
          >
            {busy ? "Cancelling..." : "Cancel order"}
          </button>
          <p style={{ color: "#888", fontSize: "13px", marginTop: "6px" }}>
            You can cancel for {mm}:{ss} more
          </p>
        </div>
      )}

      {!canCancel && !delivered && (
        <p style={{ color: "#888", fontSize: "13px", marginTop: "12px", textAlign: "center" }}>
          Cancellation is only possible within 5 minutes of ordering.
        </p>
      )}

      {error && (
        <p style={{ color: "#e74c3c", fontSize: "13px", marginTop: "8px", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default OrderTracker;