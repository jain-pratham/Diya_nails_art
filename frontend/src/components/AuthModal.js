"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, loading, setError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setError(null); // Clear errors when closing
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, setError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      onClose(); // Close modal on success
    } catch (err) {
      // Error is handled by context
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[2000] flex items-center justify-center p-4 transition-all duration-300 ${
        "opacity-100"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 transform scale-100 translate-y-0"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all duration-200 z-10"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-[#4A3324] mb-2 tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-[#8C7361] font-light">
              {isLogin
                ? "Enter your details to access your account"
                : "Join BlushNails for exclusive updates and offers"}
            </p>
          </div>

          {/* Forms */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B39178] transition-colors"
                  size={18}
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required={!isLogin}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#fbf8f4] border border-transparent focus:border-[#B39178]/30 focus:bg-white rounded-2xl outline-none text-[15px] text-[#4A3324] placeholder:text-[#b39a89] transition-all duration-200"
                />
              </div>
            )}

            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B39178] transition-colors"
                size={18}
                strokeWidth={1.5}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-[#fbf8f4] border border-transparent focus:border-[#B39178]/30 focus:bg-white rounded-2xl outline-none text-[15px] text-[#4A3324] placeholder:text-[#b39a89] transition-all duration-200"
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B39178] transition-colors"
                size={18}
                strokeWidth={1.5}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-[#fbf8f4] border border-transparent focus:border-[#B39178]/30 focus:bg-white rounded-2xl outline-none text-[15px] text-[#4A3324] placeholder:text-[#b39a89] transition-all duration-200"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  onClick={onClose}
                  className="text-xs text-[#B39178] hover:text-[#76543F] font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#76543F] text-white rounded-2xl font-semibold text-[15px] shadow-lg shadow-[#76543F]/20 hover:bg-[#5d4232] active:scale-[0.98] transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-[13px] font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-[13px] font-medium text-gray-700">GitHub</span>
            </button>
          </div>

          {/* Toggle Link */}
          <p className="text-center mt-8 text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#B39178] font-bold hover:underline decoration-offset-4"
            >
              {isLogin ? "Sign up now" : "Log in"}
            </button>
          </p>
        </div>

        {/* Bottom Banner (Optional visual flair) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#F7F1E5] via-[#B39178] to-[#76543F]" />
      </div>
    </div>
  );
}
