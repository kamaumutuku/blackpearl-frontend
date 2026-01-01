import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "./context/UserAuthContext";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import App from "./App";
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      <UserAuthProvider>
          <CartProvider>
            <App />
            <Toaster position="top-right" reverseOrder={false} />
          </CartProvider>
      </UserAuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);
