"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Printer, ArrowLeft } from "lucide-react";
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
    <div className="w-full flex flex-col items-center invoice-print-container">
      
      {/* Precision Full A4 Print Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 7mm 7mm 7mm 7mm;
          }
          html, body {
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-size: 8.5pt !important;
            line-height: 1.3 !important;
          }
          .invoice-no-print {
            display: none !important;
          }
          .invoice-print-container {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .invoice-page-sheet {
            width: 100% !important;
            max-width: 100% !important;
            min-height: 280mm !important;
            margin: 0 auto !important;
            padding: 5mm 6mm !important;
            border: 1.5px solid #000000 !important;
            box-shadow: none !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            font-size: 8.5pt !important;
            line-height: 1.3 !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .invoice-addresses-row {
            display: flex !important;
            flex-direction: row !important;
            width: 100% !important;
          }
          .invoice-address-col {
            flex: 1 1 0% !important;
            min-width: 0 !important;
            padding: 6px 8px !important;
            border-right: 1px solid #000000 !important;
          }
          .invoice-address-col:last-child {
            border-right: none !important;
          }
          .invoice-meta-row {
            display: flex !important;
            flex-direction: row !important;
            width: 100% !important;
          }
          .invoice-meta-col {
            flex: 1 1 0% !important;
            min-width: 0 !important;
            padding: 4px 6px !important;
            border-right: 1px solid #000000 !important;
          }
          .invoice-meta-col:last-child {
            border-right: none !important;
          }
          .invoice-summary-row {
            display: flex !important;
            flex-direction: row !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .invoice-summary-left {
            flex: 1.15 1 0% !important;
            min-width: 0 !important;
            padding-right: 8px !important;
            border-right: 1px solid #000000 !important;
          }
          .invoice-summary-right {
            flex: 0.85 1 0% !important;
            min-width: 0 !important;
            padding-left: 8px !important;
          }
          .invoice-signatory-row {
            display: flex !important;
            flex-direction: row !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .invoice-declaration-left {
            flex: 1.6 1 0% !important;
            min-width: 0 !important;
            padding-right: 8px !important;
            border-right: 1px solid #000000 !important;
          }
          .invoice-signatory-right {
            flex: 1 1 0% !important;
            min-width: 0 !important;
            padding-left: 8px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            align-items: center !important;
            text-align: center !important;
          }
          .invoice-avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          table {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          thead {
            display: table-header-group !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .invoice-cell-padding {
            padding: 4px 6px !important;
          }
        }
      `}} />

      {/* Top Action Bar (Hidden on Print) */}
      {showControls && (
        <div className="w-full max-w-[820px] mb-4 flex items-center justify-between px-4 py-3 bg-stone-900 text-stone-100 rounded-2xl shadow-md print:hidden invoice-no-print">
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
              <span>Print / Download PDF (A4)</span>
            </button>
          </div>
        </div>
      )}

      {/* Official Tax Invoice Document (True Full A4 Proportions: 820px x ~1120px) */}
      <div 
        ref={invoiceRef}
        className="invoice-page-sheet w-full max-w-[820px] min-h-[1050px] bg-white text-black p-6 sm:p-8 font-sans border-2 border-black shadow-2xl print:shadow-none print:border print:p-0 print:m-0 text-[10px] sm:text-[10.5px] leading-snug select-text flex flex-col justify-between"
        style={{ color: "#000000" }}
      >
        
        {/* Upper Document Section */}
        <div className="w-full">
          
          {/* 1. Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-black pb-3 mb-3">
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight uppercase text-black">
                Tax Invoice / Bill of Supply / Cash Memo
              </h1>
              <p className="text-[9px] text-stone-700 font-medium mt-0.5">
                (Original for Recipient • Issued under Section 31 of CGST Act, 2017)
              </p>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <div className="flex items-center justify-end gap-1.5">
                  {/* Maha Sell Luxury Emblem Icon */}
                  <svg width="22" height="22" viewBox="0 0 100 100" fill="none" className="shrink-0">
                    <rect x="12" y="12" width="76" height="76" rx="22" transform="rotate(45 50 50)" fill="#FAF7F2" stroke="#D4AF37" strokeWidth="6" />
                    <path d="M30 68V34L50 54L70 34V68" stroke="#3E0C15" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-[#3E0C15]">
                    Maha Sell
                  </span>
                </div>
                <p className="text-[9px] uppercase tracking-wider text-stone-600 font-semibold mt-0.5">
                  www.mahasell.in • India&apos;s Mega Store
                </p>
              </div>
            </div>
          </div>

          {/* 2. Top Addresses: Sold By | Billing Address | Shipping Address (Full A4 3-Column Width) */}
          <div className="invoice-addresses-row border border-black mb-3 flex text-[9px] sm:text-[9.5px] leading-tight">
            
            {/* Column A: Sold By (Principal Place of Business - Form GST REG-06) */}
            <div className="invoice-address-col flex-1 p-2.5 border-r border-black space-y-1">
              <h2 className="font-bold text-[10px] uppercase tracking-wider border-b border-stone-300 pb-0.5 text-black">
                Sold By:
              </h2>
              <div className="font-bold text-[11px] text-black">
                {SELLER_DETAILS.name}
              </div>
              <div className="text-[9.5px] text-stone-900 font-bold">
                {SELLER_DETAILS.legalName}
              </div>
              <div className="text-[8.5px] text-stone-600">
                Trade Name: {SELLER_DETAILS.tradeName}
              </div>
              <div className="text-[9px] leading-tight text-stone-800 pt-0.5">
                Building: {SELLER_DETAILS.buildingNo}, Street: {SELLER_DETAILS.roadStreet},<br />
                {SELLER_DETAILS.city}, Dist: {SELLER_DETAILS.district},<br />
                {SELLER_DETAILS.state} - {SELLER_DETAILS.pincode}, {SELLER_DETAILS.country}
              </div>
              <div className="pt-1 text-[8.5px] space-y-0.5 border-t border-stone-200 mt-1">
                <p><span className="font-bold">PAN No:</span> <span className="font-mono font-bold text-black">{SELLER_DETAILS.pan}</span></p>
                <p><span className="font-bold">GSTIN:</span> <span className="font-mono font-bold text-black">{SELLER_DETAILS.gstin}</span></p>
                <p><span className="font-bold">State/UT:</span> Uttar Pradesh (Code: {SELLER_DETAILS.stateCode})</p>
              </div>
            </div>

            {/* Column B: Billing Address */}
            <div className="invoice-address-col flex-1 p-2.5 border-r border-black space-y-1">
              <h2 className="font-bold text-[10px] uppercase tracking-wider border-b border-stone-300 pb-0.5 text-black">
                Billing Address:
              </h2>
              <div className="font-bold text-[11px] text-black">
                {data.customer.name}
              </div>
              <div className="text-[9px] leading-tight text-stone-800">
                {data.customer.address},<br />
                {data.customer.city}, {data.customer.state} - {data.customer.pincode}
              </div>
              <div className="pt-1 text-[8.5px] space-y-0.5 border-t border-stone-200 mt-1">
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
            <div className="invoice-address-col flex-1 p-2.5 space-y-1">
              <h2 className="font-bold text-[10px] uppercase tracking-wider border-b border-stone-300 pb-0.5 text-black">
                Shipping Address:
              </h2>
              <div className="font-bold text-[11px] text-black">
                {data.customer.name}
              </div>
              <div className="text-[9px] leading-tight text-stone-800">
                {data.customer.address},<br />
                {data.customer.city}, {data.customer.state} - {data.customer.pincode}
              </div>
              <div className="pt-1 text-[8.5px] space-y-0.5 border-t border-stone-200 mt-1">
                <p><span className="font-bold">State/UT Code:</span> {data.customerStateCode}</p>
                <p><span className="font-bold">Place of supply:</span> {data.placeOfSupply}</p>
                <p><span className="font-bold">Place of delivery:</span> {data.placeOfDelivery}</p>
              </div>
            </div>

          </div>

          {/* 3. Order & Invoice Meta Bar (Guaranteed 4 Columns Full Width) */}
          <div className="invoice-meta-row border border-black mb-3 flex text-[9px] bg-stone-50 print:bg-transparent">
            <div className="invoice-meta-col flex-1 p-2 border-r border-black">
              <span className="text-stone-600 block text-[8px] uppercase font-bold">Order Number:</span>
              <span className="font-mono font-bold text-black text-[10.5px]">{data.orderId}</span>
            </div>
            <div className="invoice-meta-col flex-1 p-2 border-r border-black">
              <span className="text-stone-600 block text-[8px] uppercase font-bold">Order Date:</span>
              <span className="font-semibold text-black">{data.invoiceDate}, {data.invoiceTime}</span>
            </div>
            <div className="invoice-meta-col flex-1 p-2 border-r border-black">
              <span className="text-stone-600 block text-[8px] uppercase font-bold">Invoice Number:</span>
              <span className="font-mono font-bold text-black text-[10.5px]">{data.invoiceNumber}</span>
            </div>
            <div className="invoice-meta-col flex-1 p-2">
              <span className="text-stone-600 block text-[8px] uppercase font-bold">Invoice Date:</span>
              <span className="font-semibold text-black">{data.invoiceDate}</span>
            </div>
          </div>

          {/* 4. Itemized Product Table */}
          <div className="border border-black mb-3">
            <table className="w-full border-collapse text-[9px] sm:text-[9.5px]">
              <thead>
                <tr className="bg-stone-100 border-b border-black text-black font-bold text-center">
                  <th className="p-1.5 border-r border-black w-7 invoice-cell-padding">Sl.</th>
                  <th className="p-1.5 border-r border-black text-left invoice-cell-padding">Description</th>
                  <th className="p-1.5 border-r border-black w-16 invoice-cell-padding">HSN</th>
                  <th className="p-1.5 border-r border-black w-8 invoice-cell-padding">Qty</th>
                  <th className="p-1.5 border-r border-black w-16 text-right invoice-cell-padding">Gross</th>
                  <th className="p-1.5 border-r border-black w-16 text-right invoice-cell-padding">Taxable</th>
                  {data.isIntraState ? (
                    <>
                      <th className="p-1.5 border-r border-black w-14 text-right invoice-cell-padding">CGST (2.5%)</th>
                      <th className="p-1.5 border-r border-black w-14 text-right invoice-cell-padding">SGST (2.5%)</th>
                    </>
                  ) : (
                    <th className="p-1.5 border-r border-black w-16 text-right invoice-cell-padding">IGST (5%)</th>
                  )}
                  <th className="p-1.5 w-16 text-right invoice-cell-padding">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.slNo} className="border-b border-black/40 text-black invoice-avoid-break">
                    <td className="p-2 border-r border-black text-center font-mono invoice-cell-padding">{item.slNo}</td>
                    <td className="p-2 border-r border-black invoice-cell-padding">
                      <div className="font-bold text-[9.5px] leading-tight text-stone-900">{item.title}</div>
                      <div className="text-[8px] text-stone-500 font-mono mt-0.5">SKU: {item.sku}</div>
                    </td>
                    <td className="p-2 border-r border-black text-center font-mono text-[9px] invoice-cell-padding">{item.hsn}</td>
                    <td className="p-2 border-r border-black text-center font-mono font-semibold invoice-cell-padding">{item.qty}</td>
                    <td className="p-2 border-r border-black text-right font-mono invoice-cell-padding">₹{item.grossAmount.toFixed(2)}</td>
                    <td className="p-2 border-r border-black text-right font-mono invoice-cell-padding">₹{item.taxableValue.toFixed(2)}</td>
                    {data.isIntraState ? (
                      <>
                        <td className="p-2 border-r border-black text-right font-mono invoice-cell-padding">₹{item.cgstAmount.toFixed(2)}</td>
                        <td className="p-2 border-r border-black text-right font-mono invoice-cell-padding">₹{item.sgstAmount.toFixed(2)}</td>
                      </>
                    ) : (
                      <td className="p-2 border-r border-black text-right font-mono invoice-cell-padding">₹{item.igstAmount.toFixed(2)}</td>
                    )}
                    <td className="p-2 text-right font-mono font-bold text-black invoice-cell-padding">₹{item.total.toFixed(2)}</td>
                  </tr>
                ))}

                {/* Subtotal row */}
                <tr className="bg-stone-50 border-t border-black font-bold text-black invoice-avoid-break">
                  <td colSpan={3} className="p-2 border-r border-black text-right uppercase text-[9px] invoice-cell-padding">
                    Total
                  </td>
                  <td className="p-2 border-r border-black text-center invoice-cell-padding">
                    {data.items.reduce((acc, it) => acc + it.qty, 0)}
                  </td>
                  <td className="p-2 border-r border-black text-right font-mono invoice-cell-padding">₹{data.grossSubtotal.toFixed(2)}</td>
                  <td className="p-2 border-r border-black text-right font-mono invoice-cell-padding">₹{data.totalTaxable.toFixed(2)}</td>
                  {data.isIntraState ? (
                    <>
                      <td className="p-2 border-r border-black text-right font-mono invoice-cell-padding">₹{data.totalCgst.toFixed(2)}</td>
                      <td className="p-2 border-r border-black text-right font-mono invoice-cell-padding">₹{data.totalSgst.toFixed(2)}</td>
                    </>
                  ) : (
                    <td className="p-2 border-r border-black text-right font-mono invoice-cell-padding">₹{data.totalIgst.toFixed(2)}</td>
                  )}
                  <td className="p-2 text-right font-mono font-bold text-black text-[10.5px] invoice-cell-padding">
                    ₹{data.grandTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Lower Document Section (Anchored to Bottom of A4) */}
        <div className="w-full invoice-avoid-break mt-auto pt-2">
          
          {/* 5. Summary, Words & Payment Details Grid (2 Columns Full Width) */}
          <div className="invoice-summary-row border border-black p-2.5 mb-2.5 flex text-[9px] leading-tight">
            
            {/* Left Details: Amount in words, Payment mode */}
            <div className="invoice-summary-left flex-[1.15] pr-3 border-r border-black space-y-1.5">
              <div>
                <span className="font-bold text-black uppercase block text-[8px]">Amount in Words:</span>
                <p className="font-bold text-[10px] text-stone-900 italic leading-snug">
                  {data.totalInWords}
                </p>
              </div>

              <div className="pt-1.5 border-t border-stone-200 space-y-0.5 text-[8.5px]">
                <p><span className="font-bold">Payment Method:</span> <span className="font-semibold text-black">{data.paymentMode}</span></p>
                <p><span className="font-bold">Transaction / Ref ID:</span> <span className="font-mono text-stone-700">{data.paymentRef}</span></p>
                <p><span className="font-bold">Payment Status:</span> <span className="font-bold text-emerald-800 uppercase">{data.paymentStatus}</span></p>
                <p className="text-[8px] text-stone-600">
                  Whether tax is payable on reverse charge basis: <strong className="text-black">No</strong>
                </p>
              </div>
            </div>

            {/* Right Details: Financial Totals */}
            <div className="invoice-summary-right flex-[0.85] pl-3 space-y-0.5 text-[9px]">
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
              <div className="flex justify-between items-baseline pt-1.5 border-t-2 border-black text-[11px] font-bold text-black mt-1">
                <span className="uppercase">Grand Total:</span>
                <span className="font-mono text-base font-bold">₹{data.grandTotal.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* 6. Legal Declaration & Authorized Signatory Box */}
          <div className="invoice-signatory-row border border-black p-2.5 mb-2 flex text-[8.5px] leading-tight">
            
            <div className="invoice-declaration-left flex-[1.6] pr-3 border-r border-black space-y-1 text-stone-700">
              <p className="font-bold uppercase text-black text-[9px]">Declaration:</p>
              <p>1. The goods sold are intended for end-user consumption and not for resale.</p>
              <p>2. All disputes are subject to Kushinagar, Uttar Pradesh jurisdiction only.</p>
              <p>3. Certified that the particulars given above are true and correct and the amount indicated represents the price actually charged.</p>
            </div>

            <div className="invoice-signatory-right flex-1 pl-3 flex flex-col justify-between items-center text-center">
              <div className="font-bold text-black text-[9.5px]">
                For {SELLER_DETAILS.legalName}
              </div>
              <div className="text-[8px] text-stone-600">
                (Platform: {SELLER_DETAILS.name})
              </div>

              {/* Realistic Digital Seal / Signature Stamp */}
              <div className="my-1 p-1.5 border border-dashed border-amber-900/60 rounded-md bg-amber-50/50 flex flex-col items-center">
                <span className="font-mono text-[7.5px] font-bold tracking-wider text-[#3E0C15] uppercase">
                  DIGITALLY SIGNED &amp; VERIFIED
                </span>
                <span className="text-[7px] text-stone-700 font-medium font-mono">
                  GSTIN: {SELLER_DETAILS.gstin}
                </span>
                <span className="text-[7px] text-stone-600">
                  Kushinagar (U.P.) • {data.invoiceDate}
                </span>
              </div>

              <div className="font-bold uppercase tracking-wider text-black text-[8px] border-t border-black/40 pt-0.5 w-full text-center">
                Authorized Signatory
              </div>
              <div className="text-[7.5px] text-stone-600 font-medium">
                Sanjay Kumar Yadav (Director)
              </div>
            </div>

          </div>

          {/* 7. Footer Disclaimer */}
          <div className="text-center text-[8px] text-stone-500 pt-1.5 border-t border-stone-200">
            <p>
              This is a computer generated invoice issued under Form GST REG-06 and does not require physical signature.
            </p>
            <p className="mt-0.5">
              Support: {SELLER_DETAILS.email} | Phone: {SELLER_DETAILS.phone} | Principal Place: Karkhana, Batulahiya, Kushinagar, Uttar Pradesh - 274402
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
