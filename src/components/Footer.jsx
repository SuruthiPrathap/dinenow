import { MapPin, Phone, Mail, Clock, UtensilsCrossed } from "lucide-react";

const branches = [
  { city: "Chennai", phone: "98765 43201" },
  { city: "Coimbatore", phone: "98765 43202" },
  { city: "Madurai", phone: "98765 43203" },
  { city: "Tiruchirappalli", phone: "98765 43204" },
  { city: "Salem", phone: "98765 43205" },
  { city: "Tirunelveli", phone: "98765 43206" },
  { city: "Erode", phone: "98765 43207" },
  { city: "Vellore", phone: "98765 43208" },
  { city: "Thanjavur", phone: "98765 43209" },
  { city: "Tiruppur", phone: "98765 43210" }
];

const item = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#ddd",
  fontSize: "14px"
};

function Footer() {
  return (
    <footer
      id="contact"
      style={{
        backgroundColor: "rgba(17,17,17,0.92)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(212,165,116,0.25)"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 40px 18px" }}>
        {/* Row 1: brand and contact */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#d4a574" }}>
            <UtensilsCrossed size={22} />
            <b style={{ fontSize: "20px" }}>DineNow</b>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "22px" }}>
            <span style={item}>
              <Phone size={15} color="#d4a574" /> +91 98765 43210
            </span>
            <span style={item}>
              <Mail size={15} color="#d4a574" /> hello@dinenow.com
            </span>
            <span style={item}>
              <Clock size={15} color="#d4a574" /> Open 24 hours
            </span>
          </div>
        </div>

        {/* Row 2: branches with numbers */}
        <div style={{ margin: "18px 0", paddingTop: "18px", borderTop: "1px solid #2a2a2a" }}>
          <span style={{ ...item, color: "#d4a574", marginBottom: "12px" }}>
            <MapPin size={15} /> Our branches in Tamil Nadu
          </span>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
           {branches.map((b) => (
  <div
    key={b.city}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 14px",
      borderRadius: "20px",
      border: "1px solid rgba(212,165,116,0.35)",
      fontSize: "13px",
      cursor: "default",
      userSelect: "text"
    }}
  >
    <b style={{ color: "#d4a574" }}>{b.city}</b>
    <span style={{ color: "#ccc", display: "flex", alignItems: "center", gap: "4px" }}>
      <Phone size={12} /> {b.phone}
    </span>
  </div>
))}
          </div>
        </div>

        {/* Row 3: copyright */}
        <p style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>
          © 2026 DineNow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;