import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, PackageSearch } from "lucide-react";
import OrderTracker from "../components/OrderTracker";
import { getMyOrders, forgetOrder } from "../myOrders";

function MyOrders() {
  const [orders, setOrders] = useState(getMyOrders);

  function remove(id) {
    if (!window.confirm("Remove this order from this list?")) return;
    forgetOrder(id);
    setOrders(getMyOrders());
  }

  const when = (ms) =>
    ms ? new Date(ms).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "rgba(10,10,10,0.9)", padding: "30px var(--pad)" }}>
      <div style={{ maxWidth: "620px", margin: "0 auto" }}>
        <Link
          to="/"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#d4a574", textDecoration: "none", marginBottom: "20px" }}
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <h2 style={{ color: "#d4a574", marginBottom: "6px" }}>My Orders</h2>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>
          {orders.length} order{orders.length === 1 ? "" : "s"} on this device. Old orders stay here until you remove them.
        </p>

        {orders.length === 0 && (
          <div style={{ textAlign: "center", color: "#aaa", padding: "60px 0" }}>
            <PackageSearch size={48} color="#d4a574" />
            <p style={{ marginTop: "12px" }}>No orders on this device yet.</p>
          </div>
        )}

        {orders.map((o) => (
          <div
            key={o.id}
            style={{ padding: "18px", borderRadius: "14px", backgroundColor: "#1a1a1a", border: "1px solid #333", marginBottom: "18px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <b style={{ color: "#d4a574", fontSize: "18px" }}>{o.number}</b>
              <Trash2 size={18} color="#888" style={{ cursor: "pointer" }} title="Remove from this list" onClick={() => remove(o.id)} />
            </div>
            <div style={{ color: "#888", fontSize: "13px", marginBottom: "10px" }}>{when(o.placedAt)}</div>

            <div style={{ color: "#ccc", marginBottom: "12px", fontSize: "15px" }}>
              {(o.items || []).map((i, n) => (
                <div key={n}>{i.qty} x {i.name}</div>
              ))}
              <div style={{ marginTop: "4px" }}>
                Total: <b style={{ color: "#d4a574" }}>₹{o.total}</b>
              </div>
            </div>

            <OrderTracker order={o} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;