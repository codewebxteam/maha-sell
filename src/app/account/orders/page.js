"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Package, 
  ArrowLeft, 
  ChevronRight, 
  ExternalLink, 
  Truck, 
  CheckCircle2, 
  FileText,
  Ban,
  X,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Check
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation Modal State
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("Ordered by mistake");
  const [cancelComments, setCancelComments] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function fetchUserOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(d => !d.isDeleted);

        // Sort in memory by createdAt / date descending (newest first)
        fetched.sort((a, b) => {
          const timeA = a.createdAt?.seconds 
            ? a.createdAt.seconds * 1000 
            : a.createdAt?.toDate 
            ? a.createdAt.toDate().getTime() 
            : (new Date(a.date || 0).getTime() || 0);
          const timeB = b.createdAt?.seconds 
            ? b.createdAt.seconds * 1000 
            : b.createdAt?.toDate 
            ? b.createdAt.toDate().getTime() 
            : (new Date(b.date || 0).getTime() || 0);
          return timeB - timeA;
        });

        setOrders(fetched);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserOrders();
  }, [user]);

  // Handle Cancellation confirmation
  const handleConfirmCancellation = async () => {
    if (!cancelModalOrder) return;
    setIsCancelling(true);
    try {
      const fullReason = cancelReason + (cancelComments.trim() ? ` - ${cancelComments.trim()}` : "");
      const orderRef = doc(db, "orders", cancelModalOrder.id);
      
      await updateDoc(orderRef, {
        status: "Cancelled",
        cancelledAt: serverTimestamp(),
        cancelledBy: "Customer",
        cancellationReason: fullReason,
        updatedAt: serverTimestamp()
      });

      // Update in local state
      setOrders(prev => prev.map(o => {
        if (o.id === cancelModalOrder.id) {
          return {
            ...o,
            status: "Cancelled",
            cancelledBy: "Customer",
            cancellationReason: fullReason,
            cancelledAt: { seconds: Math.floor(Date.now() / 1000) }
          };
        }
        return o;
      }));

      // Update sessionStorage cache if matching
      try {
        const cached = sessionStorage.getItem("mahasell_view_order");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.id === cancelModalOrder.id) {
            parsed.status = "Cancelled";
            parsed.cancellationReason = fullReason;
            sessionStorage.setItem("mahasell_view_order", JSON.stringify(parsed));
          }
        }
      } catch (e) {}

      setToastMessage(`Order #${cancelModalOrder.id} has been cancelled successfully.`);
      setCancelModalOrder(null);
      setCancelComments("");
      setCancelReason("Ordered by mistake");
      
      // Auto-clear toast after 5s
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel order. Please verify your connection or contact customer support.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-3 shadow-md animate-in fade-in">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                <Check className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
            <Link href="/account" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#3E0C15]">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Account Dashboard</span>
            </Link>
            <span className="text-xs text-[#9E7D2E] font-bold uppercase tracking-wider">My Orders</span>
          </div>

          <div className="mb-8">
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#2D0A10]">
              My Orders &amp; Heirloom Drapes
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Track active shipments, cancel pending orders, view invoices, or re-order your cherished weaves.
            </p>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12 text-stone-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-amber-900/10 p-8 sm:p-12 text-center shadow-sm">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <h3 className="font-serif-luxury text-xl font-bold text-stone-900 mb-2">No Orders Found</h3>
                <p className="text-stone-500 text-sm mb-6">You haven&apos;t placed any orders with us yet.</p>
                <Link href="/collections" className="inline-flex px-6 py-2.5 bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#571520] transition-colors">
                  Explore Collections
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const orderDateDisplay = order.date 
                  ? order.date 
                  : order.createdAt?.seconds 
                  ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
                  : "Recently Placed";

                const s = (order.status || "").toLowerCase();
                const isCancelled = s.includes("cancel");
                const isDelivered = s.includes("deliver");
                const isDispatched = s.includes("dispatch") || s.includes("transit");
                const canCancel = !isCancelled && !isDelivered;

                return (
                  <div key={order.id} className="bg-white rounded-3xl border border-amber-900/10 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900">Order #{order.id}</span>
                          <span className="text-stone-300">•</span>
                          <span className="text-xs text-stone-500">{orderDateDisplay}</span>
                        </div>
                        <p className="text-xs font-bold text-[#3E0C15] mt-1">
                          Total: ₹{(order.totalAmount || order.total || 0).toLocaleString("en-IN")}
                          {order.paymentStatus === "Paid" ? (
                            <span className="ml-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Paid Online</span>
                          ) : (
                            <span className="ml-2 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">Cash on Delivery</span>
                          )}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {(() => {
                          let badgeClass = "bg-purple-100 text-purple-900 border border-purple-200";
                          let label = order.status || "Order Placed & Confirmed";
                          if (isCancelled) {
                            badgeClass = "bg-rose-100 text-rose-800 border border-rose-200";
                            label = "Cancelled";
                          } else if (isDelivered) {
                            badgeClass = "bg-emerald-100 text-emerald-800 border border-emerald-200";
                            label = "Delivered to Doorstep";
                          } else if (isDispatched) {
                            badgeClass = "bg-sky-100 text-sky-800 border border-sky-200";
                            label = "Dispatched & Transit";
                          } else if (s.includes("quality") || s.includes("packag") || s.includes("process")) {
                            badgeClass = "bg-amber-100 text-amber-900 border border-amber-200";
                            label = "Quality Check & Packaging";
                          }
                          return (
                            <span className={`px-3.5 py-1 font-bold rounded-full text-xs ${badgeClass}`}>
                              {label}
                            </span>
                          );
                        })()}

                        {/* Cancel Order Action */}
                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => {
                              setCancelModalOrder(order);
                              setCancelReason("Ordered by mistake");
                              setCancelComments("");
                            }}
                            className="px-3.5 py-1.5 rounded-full border border-rose-200 hover:border-rose-400 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Cancel this order"
                          >
                            <Ban className="w-3.5 h-3.5 text-rose-600" />
                            <span>Cancel Order</span>
                          </button>
                        )}

                        {/* Tax Invoice on Delivery */}
                        {isDelivered && (
                          <Link 
                            href={`/account/orders/${order.id}/invoice`} 
                            target="_blank"
                            onClick={() => {
                              try {
                                sessionStorage.setItem("mahasell_view_order", JSON.stringify(order));
                              } catch (e) {}
                            }}
                            className="px-3.5 py-1.5 rounded-full border border-stone-300 hover:border-emerald-600 hover:bg-emerald-50 text-stone-800 hover:text-emerald-950 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs bg-white"
                            title="Download official Flipkart-style Tax Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Tax Invoice</span>
                          </Link>
                        )}

                        <Link 
                          href={`/account/orders/${order.id}`} 
                          onClick={() => {
                            try {
                              sessionStorage.setItem("mahasell_view_order", JSON.stringify(order));
                              sessionStorage.setItem("suratbazar_view_order", JSON.stringify(order));
                            } catch (e) {}
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold transition-all shadow"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* Cancellation details note if cancelled */}
                    {isCancelled && (
                      <div className="mb-4 p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-rose-800">This order has been cancelled.</p>
                          {order.cancellationReason && (
                            <p className="text-[11px] text-rose-700 mt-0.5">
                              <strong>Reason:</strong> {order.cancellationReason}
                            </p>
                          )}
                          {(order.paymentStatus === "Paid" || order.razorpayPaymentId) && (
                            <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                              ✓ 100% Refund of ₹{(order.totalAmount || order.total || 0).toLocaleString("en-IN")} will be credited back to your original payment method in 5-7 business days.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                              {item.image || (item.images && item.images[0]) ? (
                                <Image src={item.image || item.images[0]} alt={item.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">No Img</div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-serif-luxury text-base font-semibold text-stone-900">{item.name}</h3>
                              <p className="text-xs text-stone-500 mt-0.5">
                                {item.blouseOption ? `${item.blouseOption} • ` : item.fabric ? `${item.fabric} • ` : ""}Qty: {item.qty || item.quantity || 1}
                              </p>
                              <p className="text-xs font-bold text-[#3E0C15] mt-1">₹{(item.price || 0).toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>

      {/* Cancellation Confirmation Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Ban className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                    Cancel Order #{cancelModalOrder.id}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Are you sure you want to cancel this order?
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCancelModalOrder(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment & Refund Status Note */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Payment &amp; Refund Notice:</span>
              </p>
              <p className="text-[11px] leading-relaxed text-amber-900">
                {(cancelModalOrder.paymentStatus === "Paid" || cancelModalOrder.razorpayPaymentId) ? (
                  <>
                    <strong>Prepaid Online:</strong> A full refund of <strong>₹{(cancelModalOrder.totalAmount || cancelModalOrder.total || 0).toLocaleString("en-IN")}</strong> will be automatically credited back to your original source account (UPI / Card / Net Banking) within 5–7 business days.
                  </>
                ) : (
                  <>
                    <strong>Cash on Delivery (COD):</strong> No payment was made. Your order will be cancelled with immediate effect and zero cancellation fee.
                  </>
                )}
              </p>
            </div>

            {/* Reason Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Reason for Cancellation <span className="text-rose-600">*</span>
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-[#3E0C15]"
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                <option value="Change of mind / Do not need it now">Change of mind / Do not need it now</option>
                <option value="Incorrect shipping address or phone">Incorrect shipping address or phone</option>
                <option value="Delivery time is taking too long">Delivery time is taking too long</option>
                <option value="Want to change color / saree design">Want to change color / saree design</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            {/* Additional Comments */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-600">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={cancelComments}
                onChange={(e) => setCancelComments(e.target.value)}
                placeholder="Tell us what went wrong to help us improve..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-[#3E0C15] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                disabled={isCancelling}
                className="px-5 py-2.5 rounded-full border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancellation}
                disabled={isCancelling}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Cancelling Order...</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    <span>Confirm Cancellation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
