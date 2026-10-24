import { createContext, useContext, useState } from "react";

const KEY = "dinenow_ratings";
const RatingContext = createContext();

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function RatingProvider({ children }) {
  const [ratings, setRatings] = useState(load);

  // Every rating is added as a new one
  function rate(id, stars) {
    setRatings((prev) => {
      const old = prev[id] || { total: 0, count: 0 };
      const updated = {
        ...prev,
        [id]: { total: old.total + stars, count: old.count + 1 }
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(updated));
      } catch {
        // storage full or blocked: ignore
      }
      return updated;
    });
  }

  // Average and number of ratings
  function getRating(id) {
    const r = ratings[id];
    if (!r || r.count === 0) return { avg: null, count: 0 };
    return { avg: (r.total / r.count).toFixed(1), count: r.count };
  }

  return (
    <RatingContext.Provider value={{ rate, getRating }}>
      {children}
    </RatingContext.Provider>
  );
}

export function useRatings() {
  return useContext(RatingContext);
}