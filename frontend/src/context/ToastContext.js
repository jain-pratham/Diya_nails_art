"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: {
    icon: CheckCircle2,
    label: "Success",
    card: "border-[#d7e8df] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(240,248,243,0.96))] text-[#21382d]",
    iconWrap: "border-[#cfe3d7] bg-white/80",
    iconClass: "text-[#2d7a55]",
    progress: "from-[#4ca87a] via-[#62b687] to-[#7cc59a]",
    glow: "shadow-[0_22px_52px_rgba(55,102,76,0.18)]",
  },
  error: {
    icon: AlertCircle,
    label: "Something went wrong",
    card: "border-[#ecd5d7] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(252,243,243,0.97))] text-[#4b2229]",
    iconWrap: "border-[#ebd4d8] bg-white/82",
    iconClass: "text-[#bb5a6a]",
    progress: "from-[#c46a79] via-[#d07b89] to-[#dea1ab]",
    glow: "shadow-[0_22px_52px_rgba(122,63,73,0.18)]",
  },
  warning: {
    icon: TriangleAlert,
    label: "Check this",
    card: "border-[#ecdcc4] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(253,248,239,0.97))] text-[#503a1f]",
    iconWrap: "border-[#ead7b7] bg-white/82",
    iconClass: "text-[#b7843d]",
    progress: "from-[#d1a15b] via-[#ddb471] to-[#ebc991]",
    glow: "shadow-[0_22px_52px_rgba(143,103,50,0.18)]",
  },
  info: {
    icon: Info,
    label: "Notice",
    card: "border-[#e9d9ca] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,247,241,0.97))] text-[#2e241d]",
    iconWrap: "border-[#ead8c8] bg-white/82",
    iconClass: "text-[#9d7960]",
    progress: "from-[#b49077] via-[#c29f87] to-[#d5b6a3]",
    glow: "shadow-[0_22px_52px_rgba(98,69,52,0.16)]",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (message, options = {}) => {
      if (!message) return "";

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const type = options.type || "info";
      const duration = options.duration ?? 3200;
      const title = options.title || TOAST_STYLES[type]?.label || "";

      setToasts((current) => [...current, { id, type, title, message }].slice(-5));

      const timeout = setTimeout(() => {
        dismiss(id);
      }, duration);

      timeoutsRef.current.set(id, timeout);
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      toast,
      success: (message, options) => toast(message, { ...options, type: "success" }),
      error: (message, options) => toast(message, { ...options, type: "error" }),
      warning: (message, options) => toast(message, { ...options, type: "warning" }),
      info: (message, options) => toast(message, { ...options, type: "info" }),
      dismiss,
    }),
    [dismiss, toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[3000] flex flex-col gap-3 sm:inset-x-auto sm:right-5 sm:top-5 sm:bottom-auto sm:w-full sm:max-w-[380px]">
        {toasts.map((item) => {
          const style = TOAST_STYLES[item.type] || TOAST_STYLES.info;
          const Icon = style.icon;

          return (
            <div
              key={item.id}
              className={`toast-enter pointer-events-auto relative overflow-hidden rounded-[22px] border backdrop-blur-xl ${style.card} ${style.glow}`}
              role="status"
              aria-live="polite"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-white/70" />
              <div className="flex items-start gap-3.5 px-4 py-4 sm:px-4.5">
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${style.iconWrap}`}>
                  <Icon size={18} className={style.iconClass} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1 pr-1">
                  {item.title ? (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-current/60">
                      {item.title}
                    </p>
                  ) : null}
                  <p className="mt-1 text-[13px] font-medium leading-5 text-current/95 sm:text-sm">
                    {item.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  className="rounded-full border border-black/5 bg-white/50 p-1.5 text-current/55 transition hover:bg-white/80 hover:text-current"
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </div>
              <div className={`h-[3px] w-full bg-gradient-to-r ${style.progress}`} />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
