import { useEffect, useState } from "react";
import {
  collection, onSnapshot, orderBy, query, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { LogOut, ShoppingBag, CalendarCheck, Trash2, Phone, MapPin } from "lucide-react";
import { auth, db } from "../firebase";
import { ADMIN_UID } from "../config";
import { autoStatus } from "../tracking";

const orderStatuses = ["New", "Preparing", "Out for delivery", "Delivered", "Cancelled"];
const bookingStatuses = ["New", "Confirmed", "Completed", "Cancelled"];

const statusColor = {
  New: "#3498db",
  Preparing: "#f1c40f",
  "Out for delivery": "#e67e22",
  Ready: "#2ecc71",
  Confirmed: "#2ecc71",
  Delivered: "#2ecc71",
  Completed: "#2ecc71",
  Cancelled: "#e74c3c"
};

const input = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: "8px",
  border: "1px solid #555",
  backgroundColor: "#222",
  color: "white",
  fontSize: "16px",
  marginBottom: "12px"
};

function when(ts) {
  const d = ts && ts.toDate ? ts.toDate() : null;
  return d ? d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "just now";
}

function Admin() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [filter, setFilter] = useState("all");

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);

  // Clock so automatic statuses update by themselves
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  const isAdmin = user && user.uid === ADMIN_UID;

  // Live data, only for the admin
  useEffect(() => {
    if (!isAdmin) return;

    const stopOrders = onSnapshot(
      query(collection(db, "orders"), orderBy("createdAt", "desc")),
      (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const stopBookings = onSnapshot(
      query(collection(db, "bookings"), orderBy("createdAt", "desc")),
      (snap) => setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => {
      stopOrders();
      stopBookings();
    };
  }, [isAdmin]);

  async function login(e) {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setError("Wrong email or password.");
    }
  }

  const setStatus = (col, id, status) => updateDoc(doc(db, col, id), { status });

  function remove(col, id) {
    if (window.confirm("Delete this record?")) deleteDoc(doc(db, col, id));
  }

  const page = { minHeight: "100vh", backgroundColor: "#111", padding: "30px var(--pad)" };

  /* ---------- still checking login ---------- */
  if (user === undefined) {
    return <div style={{ ...page, textAlign: "center", color: "#aaa" }}>Loading...</div>;
  }

  /* ---------- login form ---------- */
  if (!user) {
    return (
      <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form
          onSubmit={login}
          style={{
            width: "100%",
            maxWidth: "380px",
            padding: "30px",
            borderRadius: "16px",
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(212,165,116,0.5)"
          }}
        >
          <h2 style={{ color: "#d4a574", marginBottom: "20px" }}>Admin login</h2>
          <input
            style={input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={{ color: "#e74c3c", marginBottom: "10px" }}>{error}</p>}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#d4a574",
              color: "#111",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Log in
          </button>
        </form>
      </div>
    );
  }

  /* ---------- logged in but not the admin ---------- */
  if (!isAdmin) {
    return (
      <div style={{ ...page, textAlign: "center" }}>
        <h2>Not authorised</h2>
        <p style={{ color: "#aaa", margin: "10px 0 20px" }}>This account is not the admin.</p>
        <button
          onClick={() => signOut(auth)}
          style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #d4a574", background: "transparent", color: "#d4a574", cursor: "pointer" }}
        >
          Log out
        </button>
      </div>
    );
  }

  /* ---------- dashboard ---------- */
  const list = tab === "orders" ? orders : bookings;
  const statuses = tab === "orders" ? orderStatuses : bookingStatuses;
  const col = tab;

  // Orders use the automatic clock status. Bookings use the saved status.
  const shownStatus = (r) => (tab === "orders" ? autoStatus(r, now) : r.status);

  const newOrders = orders.filter((o) => autoStatus(o, now) === "New").length;
  const newBookings = bookings.filter((b) => b.status === "New").length;

  const tabBtn = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "30px",
    border: "1px solid #d4a574",
    backgroundColor: active ? "#d4a574" : "transparent",
    color: active ? "#111" : "#d4a574",
    fontWeight: "bold",
    cursor: "pointer"
  });
  const done = ["Delivered", "Completed", "Cancelled"];
const visible = list.filter((r) => {
  const s = shownStatus(r);
  if (filter === "active") return !done.includes(s);
  if (filter === "history") return done.includes(s);
  return true;
});

  return (
    <div style={page}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
          <h2 style={{ color: "#d4a574" }}>DineNow Admin</h2>
          <button
            onClick={() => signOut(auth)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 16px", borderRadius: "8px", border: "1px solid #555", background: "transparent", color: "#ccc", cursor: "pointer" }}
          >
            <LogOut size={16} /> Log out
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
          <button style={tabBtn(tab === "orders")} onClick={() => setTab("orders")}>
            <ShoppingBag size={18} /> Orders ({orders.length}){newOrders > 0 && ` · ${newOrders} new`}
          </button>
          <button style={tabBtn(tab === "bookings")} onClick={() => setTab("bookings")}>
            <CalendarCheck size={18} /> Bookings ({bookings.length}){newBookings > 0 && ` · ${newBookings} new`}
          </button>
        </div>

        {tab === "orders" && (
          <p style={{ color: "#888", fontSize: "14px", marginBottom: "16px" }}>
            Order status updates automatically with the delivery timer. Press a status button to override it, for example when the food really arrives.
          </p>
        )}
        <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
  {[["all", "All"], ["active", "Active"], ["history", "Delivered / Cancelled"]].map(([k, l]) => (
    <button
      key={k}
      onClick={() => setFilter(k)}
      style={{
        padding: "6px 14px",
        borderRadius: "20px",
        border: "1px solid #d4a574",
        backgroundColor: filter === k ? "#d4a574" : "transparent",
        color: filter === k ? "#111" : "#d4a574",
        cursor: "pointer",
        fontSize: "13px"
      }}
    >
      {l}
    </button>
  ))}
</div>

        {visible.length === 0 && (
          <p style={{ color: "#aaa", textAlign: "center", padding: "60px 0" }}>
            No {tab} yet. New ones appear here live.
          </p>
        )}

        <div style={{ display: "grid", gap: "16px" }}>
          {visible.map((r) => {
            const status = shownStatus(r);
            return (
              <div
                key={r.id}
                style={{
                  padding: "18px",
                  borderRadius: "14px",
                  backgroundColor: "#1a1a1a",
                  border: `1px solid ${status === "New" ? "#3498db" : "#333"}`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <b style={{ color: "#d4a574", fontSize: "18px" }}>{r.number}</b>
                    <span style={{ color: "#888", marginLeft: "12px", fontSize: "14px" }}>{when(r.createdAt)}</span>
                  </div>
                  <span style={{ color: statusColor[status], fontWeight: "bold" }}>{status}</span>
                </div>

                <div style={{ margin: "10px 0", lineHeight: "1.7" }}>
                  <div><b>{r.name}</b></div>
                  <div style={{ color: "#bbb", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Phone size={14} /> {r.phone}
                  </div>

                  {tab === "orders" ? (
                    <>
                      {r.address && (
                        <div style={{ color: "#bbb", display: "flex", alignItems: "center", gap: "6px" }}>
                          <MapPin size={14} /> {r.address}{r.city ? `, ${r.city}` : ""}
                        </div>
                      )}
                      <div style={{ color: "#bbb" }}>
                        {r.type}{r.speed ? ` · ${r.speed}` : ""}{r.etaMinutes ? ` · ETA ${r.etaMinutes} min` : ""}{r.payment ? ` · ${r.payment}` : ""}{r.table ? ` · Table ${r.table}` : ""}
                      </div>
                      <ul style={{ margin: "8px 0 0 18px", color: "#ddd" }}>
                        {(r.items || []).map((i, n) => (
                          <li key={n}>{i.qty} x {i.name} (Rs.{i.qty * i.price})</li>
                        ))}
                      </ul>
                      <div style={{ marginTop: "6px", fontWeight: "bold" }}>
                        Total: <span style={{ color: "#d4a574" }}>Rs.{r.total}</span>
                      </div>
                      {r.notes && <div style={{ color: "#aaa" }}>Notes: {r.notes}</div>}
                    </>
                  ) : (
                    <>
                      <div style={{ color: "#ddd" }}>
                        Table T{r.table} · {r.guests} guests · {r.occasion}
                      </div>
                      <div style={{ color: "#ddd" }}>{r.date} at {r.time}</div>
                      {r.notes && <div style={{ color: "#aaa" }}>Request: {r.notes}</div>}
                    </>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(col, r.id, s)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: `1px solid ${statusColor[s]}`,
                        backgroundColor: status === s ? statusColor[s] : "transparent",
                        color: status === s ? "#111" : statusColor[s],
                        fontSize: "13px",
                        cursor: "pointer"
                      }}
                    >
                      {s}
                    </button>
                  ))}
                  <Trash2
                    size={18}
                    color="#888"
                    style={{ marginLeft: "auto", cursor: "pointer" }}
                    onClick={() => remove(col, r.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;