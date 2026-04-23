"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Ticket, 
  Settings, 
  LogOut,
  ChevronRight,
  Package,
  CheckCircle2,
  Loader2,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiUrl } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "coupons", label: "Coupons", icon: Ticket },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const { user, logout, loading: authLoading } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab && SIDEBAR_ITEMS.some((item) => item.id === tab)) {
      setActiveTab(tab);
    }
  }, []);

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const response = await fetch(apiUrl("/api/orders"), {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load orders");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        setOrdersError(error.message);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user?.token]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#AF8F75]" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-light text-[#333333] mb-4">Please log in to view your account</h2>
        <Link href="/" className="bg-[#AF8F75] text-white px-8 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#8e735e] transition-colors">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 rounded-[1.75rem] border border-gray-100 bg-white p-4 shadow-sm lg:hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#AF8F75] flex items-center justify-center text-white font-bold text-lg uppercase shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold text-[#333333]">{user.name}</h2>
              <p className="truncate text-[11px] text-gray-400 font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {SIDEBAR_ITEMS.map((item) => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                  active
                    ? "border-[#AF8F75] bg-[#AF8F75] text-white"
                    : "border-gray-200 bg-white text-gray-500"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-12 items-start">
          
          {/* 🔹 SIDEBAR */}
          <aside className="hidden lg:block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-32">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
              <div className="w-12 h-12 rounded-full bg-[#AF8F75] flex items-center justify-center text-white font-bold text-lg uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-[#333333] truncate">{user.name}</h2>
                <p className="text-[11px] text-gray-400 font-medium truncate">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id 
                      ? "bg-[#AF8F75] text-white shadow-md shadow-[#AF8F75]/20" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#333333]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                    <span className="text-xs font-bold tracking-wide uppercase">{item.label}</span>
                  </div>
                  <ChevronRight size={14} className={`transition-transform duration-200 ${activeTab === item.id ? "rotate-90" : "opacity-0 group-hover:opacity-100"}`} />
                </button>
              ))}
              
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 mt-6 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
              >
                <LogOut size={18} strokeWidth={2} />
                <span className="text-xs font-bold tracking-wide uppercase">Logout</span>
              </button>
            </nav>
          </aside>

          {/* 🔹 MAIN CONTENT */}
          <main className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 lg:p-12 shadow-sm min-h-[520px]">
            {activeTab === "dashboard" && <DashboardContent user={user} orders={orders} ordersLoading={ordersLoading} />}
            {activeTab === "orders" && <OrdersContent orders={orders} loading={ordersLoading} error={ordersError} />}
            {activeTab === "addresses" && <AddressesContent user={user} />}
            {activeTab === "wishlist" && <WishlistContent />}
            {activeTab === "coupons" && <CouponsContent />}
            {activeTab === "settings" && <SettingsContent user={user} />}
          </main>

        </div>
      </div>
    </div>
  );
}

/* 🔹 Content Sub-components */

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

function DashboardContent({ user, orders, ordersLoading }) {
  const latestOrder = orders?.[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h1 className="text-xl sm:text-2xl font-light text-[#333333] mb-6 sm:mb-8">
        Welcome back, <span className="font-semibold">{user.name.split(" ")[0]}!</span>
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <StatCard icon={Package} label="Total Orders" value={ordersLoading ? "..." : orders.length} color="bg-blue-50 text-blue-600" />
        <StatCard icon={Heart} label="In Wishlist" value={user.wishlist?.length || 0} color="bg-pink-50 text-pink-600" />
        <StatCard icon={Ticket} label="Available Coupons" value="1" color="bg-orange-50 text-orange-600" />
      </div>

      <div className="border-t border-gray-50 pt-10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#333333] mb-6">Recent Order Status</h3>
        {latestOrder ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#AF8F75]">{latestOrder.orderNumber}</p>
                <p className="mt-2 text-sm text-gray-500">{formatDate(latestOrder.createdAt)}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm font-bold text-[#333333]">{formatPrice(latestOrder.total)}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-green-600">{latestOrder.orderStatus}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No recent orders found.</p>
        )}
      </div>
    </div>
  );
}

function OrdersContent({ orders, loading, error }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-lg sm:text-xl font-light text-[#333333] mb-6 sm:mb-8">Your Orders</h2>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-[#AF8F75]" size={32} />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-14 sm:py-20 border border-dashed border-gray-200 rounded-3xl">
          <ShoppingBag size={48} className="mx-auto text-gray-100 mb-4" />
          <p className="text-sm text-gray-400">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="mt-6 inline-block text-[10px] font-bold uppercase tracking-widest text-[#AF8F75] border-b border-[#AF8F75] pb-0.5">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order._id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-50 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#AF8F75]">{order.orderNumber}</p>
                  <p className="mt-2 text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                  <Link href={`/account/orders/${order._id}`} className="mt-3 inline-block text-xs font-bold uppercase tracking-widest text-[#AF8F75] underline underline-offset-4">
                    View details
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-green-700">
                    {order.orderStatus}
                  </span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-700">
                    Payment {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {order.items.map((item) => (
                  <div key={`${order._id}-${item.product}`} className="flex items-center justify-between gap-4 text-sm">
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-medium text-[#333333]">{item.name}</p>
                      <p className="mt-1 text-xs text-gray-400">Qty {item.quantity}</p>
                    </div>
                    <p className="shrink-0 font-semibold text-[#333333]">{formatPrice(item.lineTotal)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 rounded-2xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Ship to</p>
                  <p className="mt-2 leading-6 text-gray-600">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Order total</p>
                  <p className="mt-2 text-lg font-bold text-[#333333]">{formatPrice(order.total)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressesContent({ user }) {
  const { updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const addresses = user.addresses || [];

  const handleAddAddress = async (newAddress) => {
    setUpdating(true);
    try {
      const updatedAddresses = [...addresses, { ...newAddress, isDefault: addresses.length === 0 }];
      await updateProfile(
        { addresses: updatedAddresses },
        { successMessage: "Address added successfully" }
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add address:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      // If we deleted the default, set first one as default
      if (addresses[index].isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      await updateProfile(
        { addresses: updatedAddresses },
        { successMessage: "Address deleted successfully" }
      );
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleSetDefault = async (index) => {
    try {
      const updatedAddresses = addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
      }));
      await updateProfile(
        { addresses: updatedAddresses },
        { successMessage: "Default address updated" }
      );
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-light text-[#333333]">Saved Addresses</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto text-xs font-bold uppercase tracking-widest text-white bg-[#333333] px-6 py-3 rounded-lg hover:bg-black transition-colors"
        >
          Add New
        </button>
      </div>
      
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {addresses.map((addr, idx) => (
            <div key={idx} className={`p-5 sm:p-6 border-2 rounded-3xl relative transition-all duration-300 ${addr.isDefault ? 'border-[#AF8F75]/40 bg-[#AF8F75]/5 shadow-sm' : 'border-gray-100'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-4">
                <h4 className="text-xs font-bold text-[#333333] uppercase tracking-[0.15em]">{addr.label}</h4>
                <div className="flex flex-wrap gap-2">
                  {!addr.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(idx)}
                      className="text-[10px] font-bold text-[#AF8F75] hover:underline"
                    >
                      Set Default
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteAddress(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                <span className="font-bold text-[#333333]">{addr.fullName}</span><br/>
                {addr.addressLine1}<br/>
                {addr.addressLine2 && <>{addr.addressLine2}<br/></>}
                {addr.city}, {addr.state} {addr.zipCode}<br/>
                {addr.country}
              </p>

              {addr.isDefault && (
                <div className="inline-flex items-center gap-1 text-[9px] font-bold text-[#AF8F75] uppercase tracking-widest bg-white border border-[#AF8F75]/20 px-2 py-0.5 rounded shadow-sm">
                  <CheckCircle2 size={10} />
                  Default Address
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 sm:py-20 border border-dashed border-gray-200 rounded-3xl">
          <MapPin size={48} className="mx-auto text-gray-100 mb-4" />
          <p className="text-sm text-gray-400">No saved addresses found.</p>
        </div>
      )}

      {isModalOpen && (
        <AddressModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddAddress} 
          loading={updating}
        />
      )}
    </div>
  );
}

function AddressModal({ onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    label: "Home",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full sm:max-w-lg rounded-t-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto">
        <div className="p-5 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-light text-[#333333]">Add New Address</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Label (e.g. Home)</label>
                <input 
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:border-[#AF8F75] outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input 
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:border-[#AF8F75] outline-none" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Address Line 1</label>
              <input 
                required
                value={formData.addressLine1}
                onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:border-[#AF8F75] outline-none" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Address Line 2 (Optional)</label>
              <input 
                value={formData.addressLine2}
                onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:border-[#AF8F75] outline-none" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
                <input 
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:border-[#AF8F75] outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">State</label>
                <input 
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:border-[#AF8F75] outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Zip Code</label>
                <input 
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:border-[#AF8F75] outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Country</label>
                <input 
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:border-[#AF8F75] outline-none" 
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-100 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#333333] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "Adding..." : "Add Address"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function WishlistContent() {
  const { wishlist, refreshWishlist, toggleWishlist } = useAuth();
  const [loading, setLoading] = useState(true);
  const hasItems = wishlist && wishlist.length > 0;

  useEffect(() => {
    refreshWishlist().finally(() => setLoading(false));
  }, [refreshWishlist]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 py-8 sm:py-10">
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-[#AF8F75]" size={32} />
        </div>
      ) : !hasItems ? (
        <div className="text-center">
          <Heart size={48} className="mx-auto mb-6 text-gray-100" />
          <h2 className="text-lg font-light text-[#333333] mb-2">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-400 mb-8">Save items you love to find them later.</p>
          <Link href="/shop" className="inline-block bg-[#AF8F75] text-white px-8 sm:px-10 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#8e735e] transition-colors">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-lg sm:text-xl font-light text-[#333333] mb-6">Wishlist ({wishlist.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {wishlist.map((product) => (
              <article key={product._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex gap-4">
                  <Link href={`/product/${product._id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <Package size={24} />
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${product._id}`} className="line-clamp-1 text-sm font-bold text-[#333333]">
                      {product.name}
                    </Link>
                    <p className="mt-2 text-sm font-semibold text-[#AF8F75]">{formatPrice(product.price)}</p>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product._id).catch(() => {})}
                      className="mt-3 text-xs font-bold uppercase tracking-widest text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CouponsContent() {
  const toast = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const response = await fetch(apiUrl("/api/coupons"));
        const data = await response.json();
        setCoupons(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    loadCoupons();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-lg sm:text-xl font-light text-[#333333] mb-6 sm:mb-8">Available Coupons</h2>
      {loading ? (
        <Loader2 className="animate-spin text-[#AF8F75]" size={30} />
      ) : coupons.length === 0 ? (
        <p className="text-sm text-gray-400">No active coupons right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="flex border border-dashed border-[#AF8F75] rounded-2xl overflow-hidden">
              <div className="bg-[#AF8F75] p-6 flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-bold">{coupon.percent ? `${coupon.percent}%` : formatPrice(coupon.amount)}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest">Off</span>
              </div>
              <div className="p-6 flex-1 bg-white">
                <p className="text-xs font-bold text-[#333333] uppercase tracking-wide mb-1">{coupon.code}</p>
                <p className="text-[11px] text-gray-400 mb-4">On orders over {formatPrice(coupon.minimumSubtotal)}</p>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard?.writeText(coupon.code);
                    toast.success(`Coupon code ${coupon.code} copied`);
                  }}
                  className="text-[10px] font-bold text-[#AF8F75] uppercase tracking-widest border border-[#AF8F75] px-4 py-1.5 rounded hover:bg-[#AF8F75] hover:text-white transition-colors"
                >
                  Copy Code
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsContent({ user }) {
  const { updateProfile, loading: updating } = useAuth();
  const toast = useToast();
  const [verificationMessage, setVerificationMessage] = useState("");
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.password) delete dataToUpdate.password;
      
      await updateProfile(dataToUpdate, { successMessage: "Profile updated successfully" });
      setFormData((current) => ({ ...current, password: "" }));
    } catch (err) {
      // Error handled by context
    }
  };

  const resendVerification = async () => {
    setVerificationMessage("");
    try {
      const response = await fetch(apiUrl("/api/auth/resend-verification"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to generate verification link");
      }

      const message = data.verificationToken
        ? `${data.message} Token: ${data.verificationToken}`
        : data.message || "Verification link generated";
      setVerificationMessage(message);
      toast.success(data.message || "Verification link generated");
    } catch (error) {
      toast.error(error.message || "Unable to generate verification link");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-xl">
      <h2 className="text-lg sm:text-xl font-light text-[#333333] mb-6 sm:mb-8">Profile Settings</h2>
      
      <div className={`mb-6 rounded-2xl border p-4 text-xs font-bold ${user.isEmailVerified ? "border-green-100 bg-green-50 text-green-700" : "border-orange-100 bg-orange-50 text-orange-700"}`}>
        Email status: {user.isEmailVerified ? "Verified" : "Not verified"}
        {!user.isEmailVerified && (
          <button type="button" onClick={resendVerification} className="ml-3 underline underline-offset-4">
            Generate verification link
          </button>
        )}
        {verificationMessage && <p className="mt-2 font-medium normal-case tracking-normal">{verificationMessage}</p>}
      </div>

      <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#AF8F75] outline-none transition-colors" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#AF8F75] outline-none transition-colors" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
          <input 
            type="text" 
            placeholder="Enter your phone number"
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#AF8F75] outline-none transition-colors" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">New Password (leave blank to keep current)</label>
          <input 
            type="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#AF8F75] outline-none transition-colors" 
          />
        </div>
        <button 
          type="submit" 
          disabled={updating}
          className="w-full sm:w-auto bg-[#333333] text-white px-10 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-black transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {updating && <Loader2 size={16} className="animate-spin" />}
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-gray-50 p-5 sm:p-6 rounded-2xl shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={20} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-[#333333]">{value}</p>
    </div>
  );
}

const NavItem = ({ href, children, className = "" }) => (
  <Link
    href={href}
    className={`hover:text-[#AF8F75] transition-colors ${className}`}
  >
    {children}
  </Link>
);

const Icon = ({ children, className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`text-[#333333] hover:text-[#AF8F75] transition-all duration-300 ${className}`}
  >
    {children}
  </button>
);
