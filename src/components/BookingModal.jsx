import { useState } from "react";
import {
  X, CheckCircle, MessageCircle, Heart, Users, Home, PartyPopper, Briefcase, RotateCcw
} from "lucide-react";
import { RESTAURANT_WHATSAPP, RESTAURANT_NAME } from "../config";
import Confetti from "./Confetti";
import { saveBooking } from "../orders";

const COUNTER_KEY = "dinenow_booking_no";

const occasions = [
  { name: "Couple", icon: <Heart size={18} />, guests: 2 },
  { name: "Friends", icon: <Users size={18} />, guests: 4 },
  { name: "Family", icon: <Home size={18} />, guests: 5 },
  { name: "Special Occasion", icon: <PartyPopper size={18} />, guests: 6 },
  { name: "Business", icon: <Briefcase size={18} />, guests: 4 }
];

const tables = Array.from({ length: 12 }, (_, i) => i + 1);

function todayString() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// A completely empty form
function emptyForm() {
  return {
    name: "",
    phone: "",
    occasion: "Couple",
    guests: 2,
    table: 0,
    date: todayString(),
    time: "",
    notes: ""
  };
}

function nextBookingNumber() {
  let n = 1000;
  try {
    n = Number(localStorage.getItem(COUNTER_KEY)) || 1000;
    localStorage.setItem(COUNTER_KEY, String(n + 1));
  } catch {
    // ignore storage problems
  }
  return "BK-" + (n + 1);
}

function buildMessage(b) {
  const lines = [
    `*Table Booking ${b.number}* - ${RESTAURANT_NAME}`,
    "",
    `Name: ${b.name}`,
    `Phone: ${b.phone}`,
    `Occasion: ${b.occasion}`,
    `Table: ${b.table}`,
    `Guests: ${b.guests}`,
    `Date: ${b.date}`,
    `Time: ${b.time}`
  ];
  if (b.notes) lines.push("", `Special request: ${b.notes}`);
  return lines.join("\n");
}

function whatsappUrl(b) {
  return `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(buildMessage(b))}`;
}

function BookingModal({ onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState(null);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function pickOccasion(o) {
    setForm((f) => ({ ...f, occasion: o.name, guests: o.guests }));
  }

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit phone number";
    if (!form.table) e.table = "Please choose a table";
    if (!form.date) e.date = "Choose a date";
    if (!form.time) e.time = "Choose a time";
    if (form.date && form.time && form.date === todayString()) {
      const [h, m] = form.time.split(":").map(Number);
      const now = new Date();
      if (h * 60 + m < now.getHours() * 60 + now.getMinutes()) e.time = "That time has already passed";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

async function submit() {
  if (!validate()) return;

  const data = {
    name: form.name.trim(),
    phone: form.phone.trim(),
    occasion: form.occasion,
    guests: form.guests,
    table: form.table,
    date: form.date,
    time: form.time,
    notes: form.notes.trim()
  };

  try {
    const number = await saveBooking(data);
    const b = { ...data, number };
    window.open(whatsappUrl(b), "_blank");
    setBooking(b);
    setForm(emptyForm());
    setErrors({});
  } catch {
    setErrors({ form: "Could not save the booking. Check your internet and try again." });
  }
}

  function bookAnother() {
    setBooking(null);
    setForm(emptyForm());
    setErrors({});
  }

  const input = (hasError) => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: `1px solid ${hasError ? "#e74c3c" : "#555"}`,
    backgroundColor: "#222",
    color: "white",
    fontSize: "15px",
    colorScheme: "dark"
  });
  const label = { display: "block", fontSize: "13px", color: "#d4a574", margin: "16px 0 6px" };
  const errorText = { color: "#e74c3c", fontSize: "13px", marginTop: "4px" };
  const goldBtn = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#d4a574",
    color: "#111",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer"
  };
  const outlineBtn = {
    ...goldBtn,
    backgroundColor: "transparent",
    color: "#d4a574",
    border: "1px solid #d4a574",
    fontSize: "16px"
  };
  const stepBtn = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid #d4a574",
    background: "transparent",
    color: "#d4a574",
    fontSize: "20px",
    cursor: "pointer"
  };

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
        zIndex: 1200
      }}
    >
      {/* Colorful papers fall from top to bottom */}
      {booking && <Confetti />}

      <div
        className="pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "92vh",
          overflowY: "auto",
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(212,165,116,0.5)",
          borderRadius: "18px",
          padding: "clamp(18px, 5vw, 30px)"
        }}
      >
        <X
          size={26}
          color="#d4a574"
          onClick={onClose}
          style={{ position: "absolute", top: "15px", right: "15px", cursor: "pointer" }}
        />

        {/* ---------- CONFIRMATION ---------- */}
        {booking ? (
          <div style={{ textAlign: "center" }}>
            <div className="check-pop" style={{ color: "#2ecc71" }}>
              <CheckCircle size={72} />
            </div>
            <h2 style={{ margin: "12px 0 4px" }}>Table booked, {booking.name}!</h2>
            <p style={{ color: "#aaa", marginBottom: "18px" }}>We look forward to seeing you.</p>

            <div
              style={{
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid rgba(212,165,116,0.5)",
                marginBottom: "18px",
                textAlign: "left"
              }}
            >
              <p style={{ color: "#aaa", fontSize: "13px", textAlign: "center" }}>BOOKING NUMBER</p>
              <p
                style={{
                  color: "#d4a574",
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "10px"
                }}
              >
                {booking.number}
              </p>
              {[
                ["Table", "T" + booking.table],
                ["Occasion", booking.occasion],
                ["Guests", booking.guests],
                ["Date", booking.date],
                ["Time", booking.time],
                ["Phone", booking.phone]
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span style={{ color: "#aaa" }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>

            <a
              href={whatsappUrl(booking)}
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
              <MessageCircle size={20} /> Send booking on WhatsApp
            </a>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "18px" }}>
              Tap Send in WhatsApp to confirm your table with the restaurant.
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={bookAnother} style={{ ...outlineBtn, flex: "1 1 160px" }}>
                <RotateCcw size={18} /> Book another
              </button>
              <button onClick={onClose} style={{ ...goldBtn, flex: "1 1 120px", fontSize: "16px" }}>
                Close
              </button>
            </div>
          </div>
        ) : (
          /* ---------- FORM ---------- */
          <>
            <h2 style={{ fontSize: "30px", marginBottom: "4px" }}>Book a Table</h2>
            <p style={{ color: "#aaa" }}>Open 24 hours. Reserve your spot in a minute.</p>

            <label style={label}>Occasion</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {occasions.map((o) => {
                const active = form.occasion === o.name;
                return (
                  <button
                    key={o.name}
                    onClick={() => pickOccasion(o)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "30px",
                      border: "1px solid #d4a574",
                      backgroundColor: active ? "#d4a574" : "transparent",
                      color: active ? "#111" : "#d4a574",
                      fontWeight: active ? "bold" : "normal",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {o.icon} {o.name}
                  </button>
                );
              })}
            </div>

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

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 150px" }}>
                <label style={label}>Date</label>
                <input
                  type="date"
                  min={todayString()}
                  style={input(errors.date)}
                  value={form.date}
                  onChange={(e) => setField("date", e.target.value)}
                />
                {errors.date && <p style={errorText}>{errors.date}</p>}
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <label style={label}>Time</label>
                <input
                  type="time"
                  style={input(errors.time)}
                  value={form.time}
                  onChange={(e) => setField("time", e.target.value)}
                />
                {errors.time && <p style={errorText}>{errors.time}</p>}
              </div>
            </div>

            <label style={label}>Number of guests</label>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <button onClick={() => setField("guests", Math.max(1, form.guests - 1))} style={stepBtn}>
                -
              </button>
              <b style={{ fontSize: "20px", minWidth: "24px", textAlign: "center" }}>{form.guests}</b>
              <button onClick={() => setField("guests", Math.min(20, form.guests + 1))} style={stepBtn}>
                +
              </button>
            </div>

            <label style={label}>Choose your table</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
              {tables.map((t) => {
                const active = form.table === t;
                return (
                  <button
                    key={t}
                    onClick={() => setField("table", t)}
                    style={{
                      padding: "10px 0",
                      borderRadius: "8px",
                      border: "1px solid #d4a574",
                      backgroundColor: active ? "#d4a574" : "transparent",
                      color: active ? "#111" : "#d4a574",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    T{t}
                  </button>
                );
              })}
            </div>
            {errors.table && <p style={errorText}>{errors.table}</p>}

            <label style={label}>Special request (optional)</label>
            <textarea
              style={{ ...input(false), minHeight: "70px", resize: "vertical" }}
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Birthday cake, window seat, decoration..."
            />

            <button style={{ ...goldBtn, marginTop: "22px" }} onClick={submit}>
              Confirm Booking
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingModal;