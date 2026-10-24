function SectionTitle(props) {
  return (
    <div style={{ textAlign: "center", marginBottom: "clamp(24px, 5vw, 40px)" }}>
      <p style={{ color: "#d4a574", letterSpacing: "2px", margin: 0, fontSize: "clamp(12px, 3vw, 16px)" }}>
        {props.small}
      </p>
      <h2 style={{ fontSize: "clamp(26px, 6vw, 36px)", margin: "5px 0" }}>{props.title}</h2>
    </div>
  );
}

export default SectionTitle;