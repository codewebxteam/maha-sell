"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import FlipkartInvoice from "@/components/FlipkartInvoice";
import { ArrowLeft, Loader2, AlertCircle, Lock, Truck } from "lucide-react";

export default function OrderInvoicePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const rawId = params?.id;
  const autoPrint = searchParams?.get("print") === "true";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!rawId) return;
    const searchId = decodeURIComponent(rawId);

    // 1. Instant hydration from sessionStorage
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("mahasell_view_order") || sessionStorage.getItem("suratbazar_view_order");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (
            parsed.id?.toLowerCase() === searchId.toLowerCase() ||
            `OD${parsed.id}`.toLowerCase() === searchId.toLowerCase()
          ) {
            setOrder(parsed);
            setLoading(false);
          }
        }
      } catch (e) {}
    }

    // 2. Fetch fresh from Firestore
    async function fetchOrder() {
      try {
        let foundData = null;

        // Try exact ID
        const docSnap = await getDoc(doc(db, "orders", searchId));
        if (docSnap.exists()) {
          foundData = { id: docSnap.id, ...docSnap.data() };
        }

        // Try query by id field
        if (!foundData) {
          const qId = query(collection(db, "orders"), where("id", "==", searchId), limit(1));
          const snapId = await getDocs(qId);
          if (!snapId.empty) {
            foundData = { id: snapId.docs[0].id, ...snapId.docs[0].data() };
          }
        }

        // Try stripping OD prefix if exists
        if (!foundData && searchId.toUpperCase().startsWith("OD")) {
          const stripped = searchId.slice(2);
          const qStrip = query(collection(db, "orders"), where("id", "==", stripped), limit(1));
          const snapStrip = await getDocs(qStrip);
          if (!snapStrip.empty) {
            foundData = { id: snapStrip.docs[0].id, ...snapStrip.docs[0].data() };
          }
        }

        if (foundData) {
          setOrder(foundData);
        } else if (!order) {
          setError(`Order #${searchId} could not be located.`);
        }
      } catch (err) {
        console.error("Error fetching order for invoice:", err);
        if (!order) {
          setError("Failed to load invoice details. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [rawId]);

  // Handle autoPrint if query param is set
  useEffect(() => {
    if (order && autoPrint) {
      const s = (order.status || "").toLowerCase();
      if (s.includes("deliver")) {
        const t = setTimeout(() => {
          window.print();
        }, 500);
        return () => clearTimeout(t);
      }
    }
  }, [order, autoPrint]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-amber-800 animate-spin mb-3" />
        <p className="text-xs font-semibold text-stone-600">Generating Official GST Tax Invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-lg max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h2 className="font-serif-luxury text-lg font-bold text-stone-900">Invoice Unavailable</h2>
          <p className="text-xs text-stone-600">{error || "No order details found."}</p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold shadow hover:bg-[#571520] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const status = (order.status || "").toLowerCase();
  const isDelivered = status.includes("deliver");

  // If order is not delivered yet, show clean notice as requested: "deliver hone k baad invoice mil jaaye"
  if (!isDelivered) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-900/15 shadow-xl max-w-lg w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-800">
            <Lock className="w-6 h-6 text-amber-700" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#9E7D2E]">
              Maha Sell • Official Invoice Notice
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900">
              Tax Invoice Available After Delivery
            </h2>
            <p className="text-xs leading-relaxed text-stone-600">
              As per GST regulations, the official commercial Tax Invoice is generated and issued <strong>only after your parcel is marked as delivered</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-left space-y-1">
            <div className="flex justify-between items-center text-stone-500">
              <span>Order Number:</span>
              <span className="font-mono font-bold text-stone-900">{order.id}</span>
            </div>
            <div className="flex justify-between items-center text-stone-500">
              <span>Current Status:</span>
              <span className="font-bold text-amber-800 uppercase">{order.status || "In Transit"}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href={`/account/orders/${order.id}`}
              className="px-4 py-2 rounded-full border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
            >
              Order Details
            </Link>
            <Link
              href={`/track?id=${order.id}`}
              className="px-5 py-2 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold transition-all shadow flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Live Shipment</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-6 sm:py-10 px-2 sm:px-4 print:bg-white print:p-0">
      <FlipkartInvoice
        order={order}
        onBack={() => router.push(`/account/orders/${order.id}`)}
        showControls={true}
      />
    </div>
  );
}
