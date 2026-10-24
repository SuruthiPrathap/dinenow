import { createContext, useContext, useState } from "react";

const KEY = "dinenow_wishlist";
const WishlistContext = createContext();

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(load);
  const [wishOpen, setWishOpen] = useState(false);

  function toggle(id) {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // storage full or blocked: ignore
      }
      return next;
    });
  }

  const has = (id) => ids.includes(id);

  return (
    <WishlistContext.Provider value={{ ids, has, toggle, wishOpen, setWishOpen }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}