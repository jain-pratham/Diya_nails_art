"use client";

import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setWishlist(parsedUser.wishlist || []);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setWishlist(data.wishlist || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setWishlist(data.wishlist || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setWishlist([]);
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl("/api/auth/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(userData),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text.substring(0, 100));
        throw new Error(`Server error: Expected JSON but received ${contentType || "unknown"}`);
      }

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setWishlist(data.wishlist || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshWishlist = useCallback(async () => {
    if (!user?.token) {
      setWishlist([]);
      return [];
    }

    const response = await fetch(apiUrl("/api/auth/wishlist"), {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load wishlist");
    }

    setWishlist(Array.isArray(data) ? data : []);
    return data;
  }, [user?.token]);

  const toggleWishlist = useCallback(async (productId) => {
    if (!user?.token) {
      throw new Error("Please login to save wishlist items");
    }

    const isSaved = wishlist.some((item) => (item._id || item) === productId);
    const response = await fetch(apiUrl(`/api/auth/wishlist/${productId}`), {
      method: isSaved ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update wishlist");
    }

    setWishlist(Array.isArray(data) ? data : []);
    return data;
  }, [user?.token, wishlist]);

  return (
    <AuthContext.Provider
      value={{
        user,
        wishlist,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        refreshWishlist,
        toggleWishlist,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
