"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext();
const GUEST_CART_KEY = "guestCart";

const emptyCart = {
  items: [],
  subtotal: 0,
  itemCount: 0,
};

const normalizeItem = (item) => {
  const product = item.product || item;
  const quantity = Math.max(1, Number(item.quantity) || 1);
  const lineTotal = Number(product.price || 0) * quantity;

  return {
    product,
    quantity,
    lineTotal,
  };
};

const calculateCart = (items) => {
  const normalizedItems = items.map(normalizeItem).filter((item) => item.product?._id);

  return {
    items: normalizedItems,
    subtotal: normalizedItems.reduce((total, item) => total + item.lineTotal, 0),
    itemCount: normalizedItems.reduce((total, item) => total + item.quantity, 0),
  };
};

const readGuestCart = () => {
  if (typeof window === "undefined") return emptyCart;

  try {
    const stored = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
    return calculateCart(Array.isArray(stored) ? stored : []);
  } catch {
    return emptyCart;
  }
};

const writeGuestCart = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const clearGuestCart = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = useMemo(
    () =>
      user?.token
        ? {
            Authorization: `Bearer ${user.token}`,
          }
        : {},
    [user?.token]
  );

  const saveGuestItems = useCallback((items) => {
    writeGuestCart(items);
    setCart(calculateCart(items));
  }, []);

  const loadCart = useCallback(async () => {
    setError("");

    if (!user?.token) {
      setCart(readGuestCart());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const guestCart = readGuestCart();
      if (guestCart.items.length > 0) {
        for (const item of guestCart.items) {
          await fetch(apiUrl("/api/cart/items"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify({
              productId: item.product._id,
              quantity: item.quantity,
            }),
          });
        }
        clearGuestCart();
      }

      const response = await fetch(apiUrl("/api/cart"), {
        headers: authHeaders,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load cart");
      }

      setCart({
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.itemCount || 0,
      });
    } catch (err) {
      setError(err.message);
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, user?.token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!product?._id) return;

    setError("");
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    if (!user?.token) {
      const guestCart = readGuestCart();
      const existingItem = guestCart.items.find((item) => item.product._id === product._id);
      const nextItems = existingItem
        ? guestCart.items.map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  quantity: Math.min(product.stock || 999, item.quantity + safeQuantity),
                }
              : item
          )
        : [...guestCart.items, { product, quantity: Math.min(product.stock || 999, safeQuantity) }];

      saveGuestItems(nextItems);
      return;
    }

    const response = await fetch(apiUrl("/api/cart/items"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        productId: product._id,
        quantity: safeQuantity,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      const message = data.message || "Unable to add item to cart";
      setError(message);
      throw new Error(message);
    }

    setCart(data);
  };

  const updateQuantity = async (productId, quantity) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    setError("");

    if (!user?.token) {
      const guestCart = readGuestCart();
      saveGuestItems(
        guestCart.items.map((item) =>
          item.product._id === productId ? { ...item, quantity: safeQuantity } : item
        )
      );
      return;
    }

    const response = await fetch(apiUrl(`/api/cart/items/${productId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ quantity: safeQuantity }),
    });
    const data = await response.json();

    if (!response.ok) {
      const message = data.message || "Unable to update cart";
      setError(message);
      throw new Error(message);
    }

    setCart(data);
  };

  const removeFromCart = async (productId) => {
    setError("");

    if (!user?.token) {
      const guestCart = readGuestCart();
      saveGuestItems(guestCart.items.filter((item) => item.product._id !== productId));
      return;
    }

    const response = await fetch(apiUrl(`/api/cart/items/${productId}`), {
      method: "DELETE",
      headers: authHeaders,
    });
    const data = await response.json();

    if (!response.ok) {
      const message = data.message || "Unable to remove item";
      setError(message);
      throw new Error(message);
    }

    setCart(data);
  };

  const clearCart = async () => {
    setError("");

    if (!user?.token) {
      saveGuestItems([]);
      return;
    }

    const response = await fetch(apiUrl("/api/cart"), {
      method: "DELETE",
      headers: authHeaders,
    });
    const data = await response.json();

    if (!response.ok) {
      const message = data.message || "Unable to clear cart";
      setError(message);
      throw new Error(message);
    }

    setCart(data);
  };

  return (
    <CartContext.Provider
      value={{
        ...cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
