import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { useAuth } from "./UserAuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  /* =========================
     LOAD GUEST CART ONLY
  ========================= */
  useEffect(() => {
    if (user) return;

    const local = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(local);
    setLoadingCart(false);
  }, [user]);

  /* =========================
     LOGIN → BACKEND IS TRUTH
  ========================= */
  useEffect(() => {
    if (!user) return;

    const loadBackendCart = async () => {
      try {
        setLoadingCart(true);

        const { data } = await api.get("/cart");

        const normalized = (data.items || []).map((i) => ({
          _id: i.product._id,
          name: i.product.name,
          price: i.product.price,
          image: i.product.image,
          qty: i.quantity,
        }));

        setCartItems(normalized);
        localStorage.setItem("cart", JSON.stringify(normalized));
      } catch (err) {
        console.error("Cart sync failed:", err);
        setCartItems([]);
        localStorage.removeItem("cart");
      } finally {
        setLoadingCart(false);
      }
    };

    loadBackendCart();
  }, [user]);

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = async (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p._id === product._id);

      const updated = existing
        ? prev.map((p) =>
            p._id === product._id ? { ...p, qty: p.qty + 1 } : p
          )
        : [
            ...prev,
            {
              _id: product._id,
              name: product.name,
              price: product.price,
              image:
                product.image ||
                product.images?.[0] ||
                "https://via.placeholder.com/150",
              qty: 1,
            },
          ];

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    if (user) {
      try {
        await api.post("/cart", {
          productId: product._id,
          quantity: 1, // ✅ FIX
        });
      } catch (err) {
        console.error("Backend addToCart failed:", err);
      }
    }
  };

  /* =========================
     UPDATE QUANTITY
  ========================= */
  const updateQty = async (productId, qty) => {
    if (qty < 1) return removeFromCart(productId);

    setCartItems((prev) => {
      const updated = prev.map((p) =>
        p._id === productId ? { ...p, qty } : p
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    if (user) {
      try {
        await api.put("/cart", {
          productId,
          quantity: qty, // ✅ FIX
        });
      } catch (err) {
        console.error("Backend updateQty failed:", err);
      }
    }
  };

  /* =========================
     REMOVE ITEM
  ========================= */
  const removeFromCart = async (productId) => {
    setCartItems((prev) => {
      const updated = prev.filter((p) => p._id !== productId);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    if (user) {
      try {
        await api.delete(`/cart/${productId}`);
      } catch (err) {
        console.error("Backend remove failed:", err);
      }
    }
  };

  /* =========================
     CLEAR CART
  ========================= */
  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem("cart");

    if (user) {
      try {
        await api.delete("/cart");
      } catch (err) {
        console.error("Backend clearCart failed:", err);
      }
    }
  };

  const isInCart = (id) => cartItems.some((i) => i._id === id);

  const total = cartItems.reduce(
    (acc, i) => acc + i.price * i.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        isInCart,
        total,
        loadingCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
