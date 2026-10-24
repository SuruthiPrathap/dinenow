import { Link } from "react-router-dom";
import { menuData } from "../data/menuData";

function CategoryTabs({ current }) {
  return (
   <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "25px" }}>
      {Object.entries(menuData).map(([slug, cat]) => {
        const active = slug === current;
        return (
          <Link
            key={slug}
            to={`/menu/${slug}`}
            className="pill"
            style={{
              whiteSpace: "nowrap",
              padding: "7px 16px",
              borderRadius: "30px",
              textDecoration: "none",
              fontSize: "14px",
              border: "1px solid #d4a574",
              backgroundColor: active ? "#d4a574" : "transparent",
              color: active ? "#111" : "#d4a574",
              fontWeight: active ? "bold" : "normal"
            }}
          >
            {cat.title}
          </Link>
        );
      })}
    </div>
  );
}

export default CategoryTabs;