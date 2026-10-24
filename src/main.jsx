import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { RatingProvider } from "./context/RatingContext";
import { WishlistProvider } from "./context/WishlistContext";
import "./firebase";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <RatingProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </RatingProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);