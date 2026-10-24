function VegDot({ veg }) {
  const color = veg ? "#27ae60" : "#c0392b";
  return (
    <span
      title={veg ? "Veg" : "Non-veg"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "18px",
        height: "18px",
        border: `2px solid ${color}`,
        borderRadius: "3px",
        backgroundColor: "#fff",
        flexShrink: 0
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: color
        }}
      />
    </span>
  );
}

export default VegDot;