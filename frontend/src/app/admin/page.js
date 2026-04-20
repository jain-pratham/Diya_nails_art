import Link from "next/link";
import { Package, FolderTree, Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your storefront, products, and categories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Package size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Products</h3>
          <p className="text-gray-500 text-sm mb-4">Add, edit or remove nails from your store inventory.</p>
          <Link href="/admin/products" className="text-pink-600 font-medium text-sm hover:underline">
            Manage Products &rarr;
          </Link>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4">
            <FolderTree size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <p className="text-gray-500 text-sm mb-4">Organize your products by styles, occasions, or lengths.</p>
          <Link href="/admin/categories" className="text-rose-600 font-medium text-sm hover:underline">
            Manage Categories &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
