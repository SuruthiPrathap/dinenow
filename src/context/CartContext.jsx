import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  function addItem(food, qty = 1) {
    setItems((prev) => {
      const old = prev[food.id];
      return { ...prev, [food.id]: { food, qty: (old ? old.qty : 0) + qty } };
    });
  }

  function removeItem(id) {
    setItems((prev) => {
      const old = prev[id];
      if (!old) return prev;
      if (old.qty <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: { ...old, qty: old.qty - 1 } };
    });
  }

  function clearCart() {
    setItems({});
  }

  const list = Object.values(items);
  const count = list.reduce((sum, i) => sum + i.qty, 0);
  const total = list.reduce((sum, i) => sum + i.qty * i.food.priceNum, 0);

  return (
    <CartContext.Provider
      value={{ items, list, count, total, addItem, removeItem, clearCart, cartOpen, setCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}