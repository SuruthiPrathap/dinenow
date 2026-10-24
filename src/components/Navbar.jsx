import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UtensilsCrossed, CalendarCheck, Menu as MenuIcon, X } from "lucide-react";
import BookingModal from "./BookingModal";

const linkStyle = {
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
  background: "none",
  border: "none",
  fontSize: "16px",
  fontFamily: "inherit"
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goTo(id) {
    setMenuOpen(false);
    if (location.pathname === "/") {
      scrollToId(id);
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  }

  function goHome() {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openBooking() {
    setMenuOpen(false);
    setBookingOpen(true);
  }

  const bookBtn = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#d4a574",
    color: "#111",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px var(--pad)",
          backgroundColor: "rgba(17,17,17,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(212,165,116,0.25)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#d4a574" }}>
          <UtensilsCrossed size={28} />
          <h2 style={{ fontSize: "24px" }}>DineNow</h2>
        </div>

        {/* Desktop links */}
        <div className="nav-links">
          <Link to="/" style={linkStyle} onClick={goHome}>Home</Link>
          <button style={linkStyle} onClick={() => goTo("about")}>About</button>
          <button style={linkStyle} onClick={() => goTo("menu")}>Menu</button>
          <Link to="/orders" style={linkStyle}>
            My Orders
          </Link>
          <button style={linkStyle} onClick={() => goTo("contact")}>Contact</button>
          <button onClick={openBooking} style={bookBtn}>
            <CalendarCheck size={18} /> Book a Table
          </button>
        </div>

        {/* Phone: hamburger */}
        <button
          className="nav-burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "42px",
            height: "42px",
            borderRadius: "8px",
            border: "1px solid #d4a574",
            background: "transparent",
            color: "#d4a574",
            cursor: "pointer"
          }}
        >
          {menuOpen ? <X size={22} /> : <MenuIcon size={22} />}
        </button>

        {/* Phone: dropdown menu */}
        {menuOpen && (
          <div
            className="pop-in"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              padding: "12px var(--pad) 20px",
              backgroundColor: "rgba(17,17,17,0.98)",
              borderBottom: "1px solid rgba(212,165,116,0.25)"
            }}
          >
            {[
              ["Home", goHome],
              ["About", () => goTo("about")],
              ["Menu", () => goTo("menu")],
              ["Contact", () => goTo("contact")]
            ].map(([name, fn]) => (
              <button
                key={name}
                onClick={fn}
                style={{
                  ...linkStyle,
                  textAlign: "left",
                  padding: "14px 4px",
                  fontSize: "18px",
                  borderBottom: "1px solid #2a2a2a"
                }}
              >
                {name}
              </button>
            ))}
            <button onClick={openBooking} style={{ ...bookBtn, marginTop: "14px", padding: "14px" }}>
              <CalendarCheck size={18} /> Book a Table
            </button>
          </div>
        )}
      </nav>

      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </>
  );
}

export default Navbar;