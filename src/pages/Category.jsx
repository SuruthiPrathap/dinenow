import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { menuData, categoryOrder } from "../data/menuData";
import TopBar from "../components/TopBar";
import CategoryHero from "../components/CategoryHero";
import CategoryCard from "../components/CategoryCard";
import FoodModal from "../components/FoodModal";
import FloatingCartBar from "../components/FloatingCartBar";
import CartDrawer from "../components/CartDrawer";
import WishlistDrawer from "../components/WishlistDrawer";
import Footer from "../components/Footer";

const pageBackground = {
  minHeight: "100vh",
  backgroundColor: "rgba(10,10,10,0.88)"
};

// Filters for every category except Cafe
const normalFilters = [
  ["all", "All"],
  ["veg", "Veg"],
  ["nonveg", "Non-veg"],
  ["under150", "Under ₹150"]
];

function Category() {
  const { category } = useParams();
  const location = useLocation();
  const data = menuData[category];

  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("default");
  const [view, setView] = useState("grid");

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelected(null);
    setFilter("all");
    setSort("default");
  }, [category]);

  // Open a food popup when search, wishlist or the chatbot sends us here
  useEffect(() => {
    const id = location.state && location.state.openFood;
    if (!id || !data) return;
    const food = data.items.find((f) => f.id === id);
    if (food) setSelected(food);
  }, [location.key, category]);

  if (!data) {
    return (
      <div style={pageBackground}>
        <TopBar />
        <div style={{ padding: "100px var(--pad)", textAlign: "center" }}>
          <h2>Category not found</h2>
          <Link to="/" style={{ color: "#d4a574" }}>Back to Home</Link>
        </div>
        <WishlistDrawer />
        <CartDrawer />
      </div>
    );
  }

  const isCafe = category === "cafe";
  const groupNames = [...new Set(data.items.map((f) => f.group).filter(Boolean))];

  const filterList = isCafe
    ? [["all", "All"], ...groupNames.map((g) => [g, g])]
    : normalFilters;

  // Filter and sort
  let shown = [...data.items];
  if (isCafe && filter !== "all") shown = shown.filter((f) => f.group === filter);
  if (filter === "veg") shown = shown.filter((f) => f.veg);
  if (filter === "nonveg") shown = shown.filter((f) => !f.veg);
  if (filter === "under150") shown = shown.filter((f) => f.priceNum < 150);
  if (sort === "low") shown = [...shown].sort((a, b) => a.priceNum - b.priceNum);
  if (sort === "high") shown = [...shown].sort((a, b) => b.priceNum - a.priceNum);

  const isDefault = filter === "all" && sort === "default";
  const showGroups = isDefault && groupNames.length > 0;

  // Previous and next category, same order as the Menu on Home
  const index = categoryOrder.indexOf(category);
  const prev = index > 0 ? menuData[categoryOrder[index - 1]] : null;
  const next =
    index >= 0 && index < categoryOrder.length - 1
      ? menuData[categoryOrder[index + 1]]
      : null;

  function renderGrid(list) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            view === "grid"
              ? "repeat(auto-fill, minmax(min(100%, 260px), 1fr))"
              : "repeat(auto-fill, minmax(min(100%, 460px), 1fr))",
          gap: "clamp(16px, 3vw, 28px)"
        }}
      >
        {list.map((item, i) => (
          <CategoryCard
            key={item.id}
            food={item}
            index={i}
            view={view}
            onClick={() => setSelected(item)}
          />
        ))}
      </div>
    );
  }

  const toggleBtn = (active) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "38px",
    border: "1px solid #d4a574",
    backgroundColor: active ? "#d4a574" : "transparent",
    color: active ? "#111" : "#d4a574",
    cursor: "pointer"
  });

  // Slim pill used for Previous and Next
  const stepPill = (enabled) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    maxWidth: "48%",
    padding: "8px 16px",
    borderRadius: "30px",
    border: "1px solid #d4a574",
    backgroundColor: "rgba(30,30,30,0.8)",
    color: "#d4a574",
    textDecoration: "none",
    fontSize: "14px",
    whiteSpace: "nowrap",
    pointerEvents: enabled ? "auto" : "none",
    opacity: enabled ? 1 : 0.35
  });

  return (
    <div style={pageBackground}>
      <TopBar />
      <CategoryHero
        title={data.title}
        count={data.items.length}
        images={data.items.slice(0, 3).map((f) => f.image)}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "22px var(--pad) 120px" }}>
        {/* Previous / Next at the top */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            marginBottom: "22px",
            paddingBottom: "18px",
            borderBottom: "1px solid #2a2a2a"
          }}
        >
          <Link to={prev ? `/menu/${prev.slug}` : "#"} style={stepPill(!!prev)}>
            <ChevronLeft size={18} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {prev ? prev.title : "Previous"}
            </span>
          </Link>

          <Link to={next ? `/menu/${next.slug}` : "#"} style={stepPill(!!next)}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {next ? next.title : "Next"}
            </span>
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "14px",
            marginBottom: "30px"
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {filterList.map(([key, label]) => (
              <button
                key={key}
                className="pill"
                onClick={() => setFilter(key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "30px",
                  border: "1px solid #d4a574",
                  cursor: "pointer",
                  fontSize: "14px",
                  backgroundColor: filter === key ? "#d4a574" : "transparent",
                  color: filter === key ? "#111" : "#d4a574"
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                padding: "9px 14px",
                borderRadius: "8px",
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "white",
                fontSize: "14px"
              }}
            >
              <option value="default">Sort: Recommended</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>

            <div style={{ display: "flex" }}>
              <button
                title="Grid view"
                onClick={() => setView("grid")}
                style={{ ...toggleBtn(view === "grid"), borderRadius: "8px 0 0 8px" }}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                title="List view"
                onClick={() => setView("list")}
                style={{ ...toggleBtn(view === "list"), borderRadius: "0 8px 8px 0", borderLeft: "none" }}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {shown.length === 0 && (
          <p style={{ textAlign: "center", color: "#aaa", padding: "60px 0" }}>
            No dishes match this filter.
          </p>
        )}

        {showGroups
          ? groupNames.map((g) => (
              <div key={g} style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "clamp(22px, 5vw, 28px)", margin: "0 0 18px", color: "#d4a574" }}>
                  {g}
                </h2>
                {renderGrid(shown.filter((f) => f.group === g))}
              </div>
            ))
          : shown.length > 0 && renderGrid(shown)}
      </div>

      <Footer />
      <FloatingCartBar />
      <CartDrawer />
      <WishlistDrawer />
      {selected && <FoodModal food={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default Category;