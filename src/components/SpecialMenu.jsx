import SectionTitle from "./SectionTitle";
import CategoryCard from "./CategoryCard";

const menu = [
  { image: "/images/pizza.jpg", name: "Pizza", price: "₹250" },
  { image: "/images/burger.jpg", name: "Burger", price: "₹150" },
  { image: "/images/coffee.jpg", name: "Coffee", price: "₹80" },
  { image: "/images/cake.jpg", name: "Cake", price: "₹120" },
  { image: "/images/pasta.jpg", name: "Pasta", price: "₹220" },
  { image: "/images/tacos.jpg", name: "Tacos", price: "₹140" },
  { image: "/images/fries.jpg", name: "Fries", price: "₹90" },
  { image: "/images/icecream.jpg", name: "Ice Cream", price: "₹100" }
];

function SpecialMenu() {
  return (
    <div style={{ padding: "80px 40px" }}>
      <SectionTitle small="OUR MENU" title="Best Special Menu" />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}>
        {menu.map((item) => (
          <CategoryCard
            key={item.name}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
            <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button style={{
          backgroundColor: "transparent",
          color: "#d4a574",
          border: "2px solid #d4a574",
          padding: "12px 30px",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer"
        }}>
          View Full Menu
        </button>
      </div>
    </div>
  );
}

export default SpecialMenu;