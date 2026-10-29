"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  Sparkles, 
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  Tag,
  Minus,
  Boxes,
  PackageOpen,
  Store,
  Clock,
  ShieldCheck
} from "lucide-react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFabric, setFilterFabric] = useState("all");
  const [filterStock, setFilterStock] = useState("all"); // 'all', 'low', 'in-stock'

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductsList(products);
      } catch (error) {
        console.warn("Notice: Fetching products from Firestore:", error?.message || error);
        if (error?.code === "permission-denied" || error?.message?.includes("permissions")) {
          setPermissionError(true);
        }
        setProductsList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Extract dynamic filter options from loaded products
  const uniqueCategories = Array.from(new Set(productsList.map(p => p.categoryName || p.category).filter(Boolean)));
  const uniqueFabrics = Array.from(new Set(productsList.map(p => p.fabricName || p.fabric).filter(Boolean)));

  const filteredProducts = productsList.filter((p) => {
    // 1. Search filter
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.fabricName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Category filter
    const matchesCat = filterCategory === "all" || p.categoryName === filterCategory || p.category === filterCategory;
    
    // 3. Fabric filter
    const matchesFab = filterFabric === "all" || p.fabricName === filterFabric || p.fabric === filterFabric;

    // 4. Stock filter
    let matchesStock = true;
    if (filterStock === "low") matchesStock = (p.stock || 0) <= 3;
    if (filterStock === "in-stock") matchesStock = (p.stock || 0) > 3;

    return matchesSearch && matchesCat && matchesFab && matchesStock;
  });

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this product from the catalog?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProductsList(productsList.filter((item) => item.id !== id));
      } catch (error) {
        console.warn("Notice: Error deleting product:", error?.message || error);
        alert("Failed to delete product: " + (error?.message || "Check Firestore permissions"));
      }
    }
  };

  const handleStockChange = async (id, currentStock, delta) => {
    const newStock = Math.max(0, (currentStock || 0) + delta);
    try {
      await updateDoc(doc(db, "products", id), { stock: newStock });
      setProductsList(productsList.map(item => item.id === id ? { ...item, stock: newStock } : item));
    } catch (error) {
      console.warn("Notice: Error updating stock:", error?.message || error);
      alert("Failed to update stock: " + (error?.message || "Check Firestore permissions"));
    }
  };

  const lowStockCount = productsList.filter((s) => (s.stock || 0) <= 3).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Product Catalog & Inventory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your {loading ? "..." : productsList.length} products and stock levels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#F3E5C8] hover:text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-[#9B111E]/40"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {permissionError && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Firestore Database Rules Notice:</span>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Firebase Console me Firestore rules read/write ko block kar rahi hain (&quot;Missing or insufficient permissions&quot;). Humne fallback catalog display kar diya hai taaki UI empty na dikhe. Firestore me real data save karne ke liye Firebase Console &gt; Firestore Database &gt; Rules update karein.
            </p>
          </div>
        </div>
      )}

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-xs text-stone-500 font-bold uppercase">Total Product Stock</p>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            {productsList.reduce((acc, curr) => acc + (curr.stock || 0), 0)} Units
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">Across {productsList.length} active designs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-xs text-rose-600 font-bold uppercase">Low Stock Alerts</p>
          <h3 className="text-2xl font-serif font-bold text-rose-700 mt-1">
            {lowStockCount} Products
          </h3>
          <p className="text-[11px] text-rose-500 mt-0.5">Stock below threshold (≤ 3 units)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-xs text-amber-700 font-bold uppercase">Warehouse Location</p>
          <h3 className="text-lg font-bold text-stone-900 mt-1">
            Maha Sell Central Hub
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">Primary dispatch center</p>
        </div>
      </div>

      {/* Advanced Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, category, or SKU..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 focus:border-[#C5832B] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Fabric Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={filterFabric}
                onChange={(e) => setFilterFabric(e.target.value)}
                className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 cursor-pointer"
              >
                <option value="all">All Fabrics</option>
                {uniqueFabrics.map(fab => (
                  <option key={fab} value={fab}>{fab}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Stock Status Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 cursor-pointer"
              >
                <option value="all">All Stock Status</option>
                <option value="in-stock">In Stock (&gt;3)</option>
                <option value="low">Low Stock (≤3)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            
            {/* Clear All Filters */}
            {(searchQuery.trim() !== "" || filterCategory !== "all" || filterFabric !== "all" || filterStock !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                  setFilterFabric("all");
                  setFilterStock("all");
                }}
                className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category & Details</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-stone-500">
                    <div className="flex flex-col items-center gap-3">
                      <PackageOpen className="w-12 h-12 text-stone-300 stroke-1" />
                      <p className="font-semibold text-sm text-stone-700">
                        {productsList.length === 0 ? "No products added yet" : "No products match your search"}
                      </p>
                      <p className="text-xs text-stone-400 max-w-sm">
                        {productsList.length === 0 
                          ? "Your catalog is empty. Click 'Add New Product' to list your first item for Maha Sell."
                          : "Try adjusting your search query or filter criteria."}
                      </p>
                      {productsList.length === 0 && (
                        <Link
                          href="/admin/products/new"
                          className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#571520] hover:bg-[#3E0C15] text-[#FDFBF7] font-semibold text-xs rounded-xl shadow-sm transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Product</span>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-amber-50/20 transition-colors">
                    {/* Product Name & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-xl overflow-hidden bg-stone-100 relative shrink-0 border border-stone-200">
                          <img
                            src={product.images?.[0] || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm text-stone-900 hover:text-[#571520] cursor-pointer">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono">
                            SKU: {product.id?.toUpperCase()}
                          </div>
                          {product.sellerShopName && (
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                                <Store className="w-3 h-3 text-[#C5832B]" />
                                <span>Sold by: <strong>{product.sellerShopName}</strong></span>
                              </span>
                              {product.isVerified === false && (
                                <Link 
                                  href="/admin/verifications"
                                  className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded font-bold hover:underline"
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>Pending Verification</span>
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-stone-700">
                      <div className="font-semibold">{product.categoryName || product.category || "General"}</div>
                      <div className="text-[11px] text-stone-400">{product.subcategoryName || product.fabricName || ""}</div>
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4">
                      {(() => {
                        const p = Number(product.price) || 0;
                        const op = Number(product.originalPrice) || 0;
                        const disc = op > p ? Math.round(((op - p) / op) * 100) : 0;
                        return (
                          <div>
                            <div className="font-bold text-stone-900 text-sm">
                              ₹{p.toLocaleString("en-IN")}
                            </div>
                            {op > p && (
                              <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                                <span className="text-stone-400 line-through">
                                  ₹{op.toLocaleString("en-IN")}
                                </span>
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                                  {disc}% off
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          (product.stock || 0) <= 3
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}>
                          {(product.stock || 0) <= 3 ? "Low: " : "In: "}
                          {product.stock || 0}
                        </span>
                        
                        <div className="flex items-center bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                          <button 
                            onClick={() => handleStockChange(product.id, product.stock, -1)}
                            className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => handleStockChange(product.id, product.stock, 1)}
                            className="p-1 hover:bg-stone-200 text-stone-600 transition-colors border-l border-stone-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isBestseller && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold">
                            Bestseller
                          </span>
                        )}
                        {product.isNewArrival && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[9px] font-bold">
                            New
                          </span>
                        )}
                        {product.isSale && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[9px] font-bold">
                            Sale
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          title="View on Storefront"
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/new?id=${product.id}`}
                          title="Edit Product"
                          className="p-1.5 rounded-lg text-stone-500 hover:text-[#C5832B] hover:bg-amber-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          title="Delete Product"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between text-xs text-stone-500">
          <span>Showing {filteredProducts.length} of {productsList.length} Items</span>
          <span>Maha Sell Catalog Database</span>
        </div>
      </div>
    </div>
  );
}
