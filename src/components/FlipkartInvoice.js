"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Printer, Download, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { SELLER_DETAILS, calculateInvoiceData } from "@/lib/invoiceUtils";

export default function FlipkartInvoice({ order, onBack, showControls = true }) {
  const invoiceRef = useRef(null);
  const data = calculateInvoiceData(order);

  if (!data) {
    return (
      <div className="p-8 text-center text-stone-500 text-sm">
        No valid order information available to generate tax invoice.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Top Action Bar (Hidden on Print) */}
      {showControls && (
        <div className="w-full max-w-[850px] mb-4 flex items-center justify-between px-3 py-2.5 bg-stone-900 text-stone-100 rounded-2xl shadow-md print:hidden">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">Official Tax Invoice</span>
              <span className="text-xs font-mono text-stone-200 font-bold">{data.invoiceNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        FLIPKART OFFICIAL TAX INVOICE FORMAT
        Exact layout with standard grid borders, HSN codes, and GST breakdown
        ========================================================================
      */}
      <div 
        ref={invoiceRef}
        className="w-full max-w-[850px] bg-white text-black p-6 sm:p-8 font-sans border border-stone-800 shadow-xl print:shadow-none print:border-none print:p-0 print:m-0 text-[11px] leading-tight select-text"
        style={{ color: "#000000" }}
      >
        
        {/* 1. Header Banner */}
        <div className="flex items-start justify-between border-b-2 border-black pb-4 mb-3">
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight uppercase text-black">
              Tax Invoice / Bill of Supply / Cash Memo
            </h1>
            <p className="text-[10px] text-stone-700 font-medium">
              (Original for Recipient)
            </p>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="flex items-center justify-end gap-1.5">
                {/* Maha Sell Luxury Emblem Icon */}
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" className="shrink-0">
                  <rect x="12" y="12" width="76" height="76" rx="22" transform="rotate(45 50 50)" fill="#FAF7F2" stroke="#D4AF37" strokeWidth="6" />
                  <path d="M30 68V34L50 54L70 34V68" stroke="#3E0C15" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-[#3E0C15]">
                  Maha Sell
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-stone-600 font-semibold mt-0.5">
                www.mahasell.in • India's Mega Store
              </p>
            </div>
          </div>
        </div>

        {/* 2. Top Grid: Sold By | Billing Address | Shipping Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-black mb-3 divide-y md:divide-y-0 md:divide-x divide-black">
          
          {/* Column A: Sold By (Kushinagar, Uttar Pradesh, India + Dummy GSTIN) */}
          <div className="p-2.5 space-y-1">
            <h2 className="font-bold text-[11px] uppercase tracking-wider border-b border-stone-300 pb-1 text-black">
              Sold By:
            </h2>
            <div className="font-bold text-[12px] text-black">
              {SELLER_DETAILS.name}
            </div>
            <div className="text-[10px] text-stone-700 font-medium">
              {SELLER_DETAILS.registeredEntity}
            </div>
            <div className="text-[10px] leading-normal text-stone-800">
              {SELLER_DETAILS.address},<br />
              {SELLER_DETAILS.city}, {SELLER_DETAILS.state} - {SELLER_DETAILS.pincode},<br />
              {SELLER_DETAILS.country}
            </div>
            <div className="pt-1.5 text-[10px] space-y-0.5 border-t border-stone-200">
              <p><span className="font-bold">PAN No:</span> {SELLER_DETAILS.pan}</p>
              <p><span className="font-bold">GSTIN:</span> <span className="font-mono font-bold text-black">{SELLER_DETAILS.gstin}</span></p>
              <p><span className="font-bold">State/UT:</span> Uttar Pradesh (Code: {SELLER_DETAILS.stateCode})</p>
              <p><span className="font-bold">CIN:</span> {SELLER_DETAILS.cin}</p>
            </div>
          </div>

          {/* Column B: Billing Address (jaha se order hua) */}
          <div className="p-2.5 space-y-1">
            <h2 className="font-bold text-[11px] uppercase tracking-wider border-b border-stone-300 pb-1 text-black">
              Billing Address:
            </h2>
            <div className="font-bold text-[12px] text-black">
              {data.customer.name}
            </div>
            <div className="text-[10px] leading-normal text-stone-800">
              {data.customer.address},<br />
              {data.customer.city}, {data.customer.state} - {data.customer.pincode}
            </div>
            <div className="pt-1.5 text-[10px] space-y-0.5 border-t border-stone-200">
              <p><span className="font-bold">State/UT Code:</span> {data.customerStateCode}</p>
              {data.customer.mobile && (
                <p><span className="font-bold">Phone:</span> +91 {data.customer.mobile}</p>
              )}
              {data.customer.email && (
                <p className="truncate"><span className="font-bold">Email:</span> {data.customer.email}</p>
              )}
            </div>
          </div>

          {/* Column C: Shipping Address */}
          <div className="p-2.5 space-y-1">
            <h2 className="font-bold text-[11px] uppercase tracking-wider border-b border-stone-300 pb-1 text-black">
              Shipping Address:
            </h2>
            <div className="font-bold text-[12px] text-black">
              {data.customer.name}
            </div>
            <div className="text-[10px] leading-normal text-stone-800">
              {data.customer.address},<br />
              {data.customer.city}, {data.customer.state} - {data.customer.pincode}
            </div>
            <div className="pt-1.5 text-[10px] space-y-0.5 border-t border-stone-200">
              <p><span className="font-bold">State/UT Code:</span> {data.customerStateCode}</p>
              <p><span className="font-bold">Place of supply:</span> {data.placeOfSupply}</p>
              <p><span className="font-bold">Place of delivery:</span> {data.placeOfDelivery}</p>
            </div>
          </div>

        </div>

        {/* 3. Order & Invoice Meta Identifiers Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-black mb-3 divide-x divide-y sm:divide-y-0 divide-black text-[10px] bg-stone-50">
          <div className="p-2">
            <span className="text-stone-600 block text-[9px] uppercase font-bold">Order Number:</span>
            <span className="font-mono font-bold text-black text-[11px]">{data.orderId}</span>
          </div>
          <div className="p-2">
            <span className="text-stone-600 block text-[9px] uppercase font-bold">Order Date:</span>
            <span className="font-semibold text-black">{data.invoiceDate}, {data.invoiceTime}</span>
          </div>
          <div className="p-2">
            <span className="text-stone-600 block text-[9px] uppercase font-bold">Invoice Number:</span>
            <span className="font-mono font-bold text-black text-[11px]">{data.invoiceNumber}</span>
          </div>
          <div className="p-2">
            <span className="text-stone-600 block text-[9px] uppercase font-bold">Invoice Date:</span>
            <span className="font-semibold text-black">{data.invoiceDate}</span>
          </div>
        </div>

        {/* 4. Itemized Product Table (Flipkart Table Layout) */}
        <div className="overflow-x-auto border border-black mb-3">
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr className="bg-stone-100 border-b border-black text-black font-bold text-center">
                <th className="p-1.5 border-r border-black w-8">Sl.</th>
                <th className="p-1.5 border-r border-black text-left">Description</th>
                <th className="p-1.5 border-r border-black w-14">HSN</th>
                <th className="p-1.5 border-r border-black w-10">Qty</th>
                <th className="p-1.5 border-r border-black w-16 text-right">Gross Amount</th>
                <th className="p-1.5 border-r border-black w-16 text-right">Taxable Value</th>
                {data.isIntraState ? (
                  <>
                    <th className="p-1.5 border-r border-black w-16 text-right">CGST (2.5%)</th>
                    <th className="p-1.5 border-r border-black w-16 text-right">SGST (2.5%)</th>
                  </>
                ) : (
                  <th className="p-1.5 border-r border-black w-20 text-right">IGST (5.0%)</th>
                )}
                <th className="p-1.5 w-18 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/30">
              {data.items.map((item) => (
                <tr key={item.slNo} className="align-top">
                  <td className="p-1.5 border-r border-black text-center font-bold text-stone-700">
                    {item.slNo}
                  </td>
                  <td className="p-1.5 border-r border-black text-left">
                    <span className="font-bold text-black block text-[11px]">{item.title}</span>
                    <span className="text-[9px] text-stone-600 font-mono">SKU: {item.sku}</span>
                  </td>
                  <td className="p-1.5 border-r border-black text-center font-mono text-stone-800">
                    {item.hsn}
                  </td>
                  <td className="p-1.5 border-r border-black text-center font-bold">
                    {item.qty}
                  </td>
                  <td className="p-1.5 border-r border-black text-right font-mono">
                    ₹{item.grossAmount.toFixed(2)}
                  </td>
                  <td className="p-1.5 border-r border-black text-right font-mono">
                    ₹{item.taxableValue.toFixed(2)}
                  </td>
                  {data.isIntraState ? (
                    <>
                      <td className="p-1.5 border-r border-black text-right font-mono">
                        ₹{item.cgstAmount.toFixed(2)}
                      </td>
                      <td className="p-1.5 border-r border-black text-right font-mono">
                        ₹{item.sgstAmount.toFixed(2)}
                      </td>
                    </>
                  ) : (
                    <td className="p-1.5 border-r border-black text-right font-mono">
                      ₹{item.igstAmount.toFixed(2)}
                    </td>
                  )}
                  <td className="p-1.5 text-right font-mono font-bold text-black">
                    ₹{item.total.toFixed(2)}
                  </td>
                </tr>
              ))}

              {/* Subtotal summary inside table */}
              <tr className="bg-stone-50 border-t border-black font-bold text-black">
                <td colSpan={3} className="p-1.5 border-r border-black text-right uppercase">
                  Total
                </td>
                <td className="p-1.5 border-r border-black text-center">
                  {data.items.reduce((acc, it) => acc + it.qty, 0)}
                </td>
                <td className="p-1.5 border-r border-black text-right font-mono">
                  ₹{data.grossSubtotal.toFixed(2)}
                </td>
                <td className="p-1.5 border-r border-black text-right font-mono">
                  ₹{data.totalTaxable.toFixed(2)}
                </td>
                {data.isIntraState ? (
                  <>
                    <td className="p-1.5 border-r border-black text-right font-mono">
                      ₹{data.totalCgst.toFixed(2)}
                    </td>
                    <td className="p-1.5 border-r border-black text-right font-mono">
                      ₹{data.totalSgst.toFixed(2)}
                    </td>
                  </>
                ) : (
                  <td className="p-1.5 border-r border-black text-right font-mono">
                    ₹{data.totalIgst.toFixed(2)}
                  </td>
                )}
                <td className="p-1.5 text-right font-mono font-bold text-black text-[11px]">
                  ₹{data.grandTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. Summary, Words & Payment Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-black p-3 mb-3">
          
          {/* Left Details: Amount in words, Payment mode */}
          <div className="space-y-2 text-[10px]">
            <div>
              <span className="font-bold text-black uppercase block text-[9px]">Amount in Words:</span>
              <p className="font-bold text-[11px] text-stone-900 italic">
                {data.totalInWords}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-200 space-y-1">
              <p><span className="font-bold">Payment Method:</span> <span className="font-semibold text-black">{data.paymentMode}</span></p>
              <p><span className="font-bold">Transaction / Ref ID:</span> <span className="font-mono text-stone-700">{data.paymentRef}</span></p>
              <p><span className="font-bold">Payment Status:</span> <span className="font-bold text-emerald-800 uppercase">{data.paymentStatus}</span></p>
              <p className="text-[9px] text-stone-600">
                Whether tax is payable on reverse charge basis: <strong className="text-black">No</strong>
              </p>
            </div>
          </div>

          {/* Right Details: Financial Totals */}
          <div className="text-[10px] space-y-1 md:pl-4 md:border-l border-black/30">
            <div className="flex justify-between py-0.5">
              <span className="text-stone-700">Taxable Value:</span>
              <span className="font-mono font-semibold">₹{data.totalTaxable.toFixed(2)}</span>
            </div>
            {data.isIntraState ? (
              <>
                <div className="flex justify-between py-0.5">
                  <span className="text-stone-700">CGST (2.5%):</span>
                  <span className="font-mono font-semibold">₹{data.totalCgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-stone-700">SGST (2.5%):</span>
                  <span className="font-mono font-semibold">₹{data.totalSgst.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between py-0.5">
                <span className="text-stone-700">Integrated GST (5.0%):</span>
                <span className="font-mono font-semibold">₹{data.totalIgst.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-0.5">
              <span className="text-stone-700">Shipping &amp; Handling:</span>
              <span className="font-mono font-bold text-emerald-700 uppercase">FREE (₹0.00)</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between py-0.5 text-emerald-800 font-semibold">
                <span>Promotional Savings {data.couponCode ? `(${data.couponCode})` : ""}:</span>
                <span className="font-mono">-₹{data.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t-2 border-black text-[12px] font-bold text-black">
              <span className="uppercase">Grand Total:</span>
              <span className="font-mono text-base font-bold">₹{data.grandTotal.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* 6. Legal Declaration & Authorized Signatory Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-black p-3 mb-2 divide-y sm:divide-y-0 sm:divide-x divide-black text-[9px] leading-relaxed">
          
          <div className="sm:col-span-2 pr-0 sm:pr-3 pb-2 sm:pb-0 space-y-1 text-stone-700">
            <p className="font-bold uppercase text-black">Declaration:</p>
            <p>
              1. The goods sold are intended for end-user consumption and not for resale.
            </p>
            <p>
              2. All disputes are subject to Kushinagar, Uttar Pradesh jurisdiction only.
            </p>
            <p>
              3. Certified that the particulars given above are true and correct and the amount indicated represents the price actually charged.
            </p>
          </div>

          <div className="pt-2 sm:pt-0 sm:pl-3 flex flex-col justify-between items-center text-center">
            <div className="font-bold text-black text-[10px]">
              For {SELLER_DETAILS.name}
            </div>

            {/* Realistic Digital Seal / Signature Stamp */}
            <div className="my-1.5 p-1.5 border border-dashed border-amber-900/60 rounded-lg bg-amber-50/50 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full border border-amber-800 flex items-center justify-center text-amber-900 font-serif text-[10px] font-bold mb-0.5">
                MS
              </div>
              <span className="font-mono text-[8px] font-bold tracking-widest text-[#3E0C15] uppercase">
                DIGITALLY SIGNED &amp; VERIFIED
              </span>
              <span className="text-[7px] text-stone-600">
                Kushinagar (U.P.) • {data.invoiceDate}
              </span>
            </div>

            <div className="font-bold uppercase tracking-wider text-black text-[9px] border-t border-black/40 pt-1 w-full text-center">
              Authorized Signatory
            </div>
          </div>

        </div>

        {/* 7. Footer Disclaimer */}
        <div className="text-center text-[9px] text-stone-500 pt-2 border-t border-stone-200">
          <p>
            This is a computer generated invoice and does not require physical signature.
          </p>
          <p className="mt-0.5">
            Support: {SELLER_DETAILS.email} | Phone: {SELLER_DETAILS.phone} | Registered in Kushinagar, Uttar Pradesh, India
          </p>
        </div>

      </div>

    </div>
  );
}
