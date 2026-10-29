/**
 * Flipkart-style Tax Invoice Generator Utilities
 * Official Maha Sell GST Tax Invoice
 */

export const SELLER_DETAILS = {
  name: "Maha Sell",
  legalName: "SP.GOOSEBERRY TEXTILE PRIVATE LIMITED",
  registeredEntity: "SP.GOOSEBERRY TEXTILE PRIVATE LIMITED",
  tradeName: "SP.GOOSEBERRY TEXTILE PRIVATE LIMITED",
  additionalTradeName: "BUILDSMART INFRATECH",
  constitution: "Private Limited Company",
  buildingNo: "KARKHANA",
  roadStreet: "BATULAHIYA",
  address: "KARKHANA, BATULAHIYA",
  fullAddress: "Building No./Flat No.: KARKHANA, Road/Street: BATULAHIYA, Kushinagar - 274402",
  city: "Kushinagar",
  district: "Kushinagar",
  state: "Uttar Pradesh",
  pincode: "274402",
  country: "India",
  gstin: "09ABICS2544R1ZK", // Official GST REG-06 Registration Number
  pan: "ABICS2544R", // Verified PAN derived from GSTIN
  stateCode: "09", // Uttar Pradesh State Code
  directors: [
    { name: "SANJAY KUMAR YADAV", designation: "DIRECTOR" },
    { name: "POONAM YADAV", designation: "DIRECTOR" }
  ],
  regDate: "04/05/2022",
  regType: "Regular",
  email: "info@mahasell.in",
  phone: "+91 9770150015",
  website: "www.mahasell.in"
};

export const GST_STATE_CODES = {
  "jammu and kashmir": "01",
  "himachal pradesh": "02",
  "punjab": "03",
  "chandigarh": "04",
  "uttarakhand": "05",
  "haryana": "06",
  "delhi": "07",
  "new delhi": "07",
  "rajasthan": "08",
  "uttar pradesh": "09",
  "up": "09",
  "bihar": "10",
  "sikkim": "11",
  "arunachal pradesh": "12",
  "nagaland": "13",
  "manipur": "14",
  "mizoram": "15",
  "tripura": "16",
  "meghalaya": "17",
  "assam": "18",
  "west bengal": "19",
  "jharkhand": "20",
  "odisha": "21",
  "orissa": "21",
  "chhattisgarh": "22",
  "madhya pradesh": "23",
  "mp": "23",
  "gujarat": "24",
  "daman and diu": "26",
  "dadra and nagar haveli": "26",
  "maharashtra": "27",
  "andhra pradesh": "37",
  "karnataka": "29",
  "goa": "30",
  "lakshadweep": "31",
  "kerala": "32",
  "tamil nadu": "33",
  "puducherry": "34",
  "pondicherry": "34",
  "andaman and nicobar": "35",
  "telangana": "36",
  "ladakh": "38",
};

export function getStateGstCode(stateName) {
  if (!stateName) return "09";
  const clean = stateName.toLowerCase().trim();
  return GST_STATE_CODES[clean] || "09";
}

/**
 * Converts any number to Indian currency words
 * Example: 1499 -> "Rupees One Thousand Four Hundred Ninety-Nine Only"
 */
export function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertLessThanThousand(n) {
    if (n === 0) return "";
    let str = "";
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? "-" + a[n % 10] : "") + " ";
    } else if (n > 0) {
      str += a[n] + " ";
    }
    return str.trim();
  }

  const n = Math.floor(Math.abs(num || 0));
  if (n === 0) return "Rupees Zero Only";

  const crore = Math.floor(n / 10000000);
  let remainder = n % 10000000;
  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  const thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;
  const hundred = remainder;

  let res = "";
  if (crore > 0) res += convertLessThanThousand(crore) + " Crore ";
  if (lakh > 0) res += convertLessThanThousand(lakh) + " Lakh ";
  if (thousand > 0) res += convertLessThanThousand(thousand) + " Thousand ";
  if (hundred > 0) res += convertLessThanThousand(hundred) + " ";

  return ("Rupees " + res.trim() + " Only").replace(/\s+/g, " ");
}

/**
 * Calculates complete GST tax breakdown for Flipkart-style invoice
 */
export function calculateInvoiceData(order) {
  if (!order) return null;

  const rawItems = Array.isArray(order.items) ? order.items : [];
  const grandTotal = Number(order.totalAmount || order.total || 0);

  // Determine Customer State and Code
  const shipping = order.shippingDetails || {};
  const customerState = shipping.state || "Uttar Pradesh";
  const customerStateCode = getStateGstCode(customerState);
  const isIntraState = customerStateCode === "09"; // Seller is in UP (09)

  // GST Rate for Apparel & Footwear: 5% (Intra-state: 2.5% CGST + 2.5% SGST, Inter-state: 5% IGST)
  const gstRate = 0.05;

  let computedGross = 0;
  const processedItems = rawItems.map((item, index) => {
    const qty = Number(item.qty || item.quantity || 1);
    const unitPrice = Number(item.price || 0);
    const grossAmount = unitPrice * qty;
    computedGross += grossAmount;

    // Backward calculation for 5% GST inclusive pricing
    const taxableValue = Math.round((grossAmount / (1 + gstRate)) * 100) / 100;
    const taxAmount = Math.round((grossAmount - taxableValue) * 100) / 100;

    let cgstRate = 0;
    let cgstAmount = 0;
    let sgstRate = 0;
    let sgstAmount = 0;
    let igstRate = 0;
    let igstAmount = 0;

    if (isIntraState) {
      cgstRate = 2.5;
      cgstAmount = Math.round((taxAmount / 2) * 100) / 100;
      sgstRate = 2.5;
      sgstAmount = Math.round((taxAmount - cgstAmount) * 100) / 100;
    } else {
      igstRate = 5.0;
      igstAmount = taxAmount;
    }

    return {
      slNo: index + 1,
      title: item.name || item.title || "Festive Apparel",
      hsn: item.hsn || "620490", // Standard Apparel / Sarees HSN
      sku: item.sku || `MS-${String(index + 101).padStart(4, "0")}`,
      qty,
      unitPrice,
      grossAmount,
      taxableValue,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      taxAmount,
      total: grossAmount
    };
  });

  const discount = Math.max(0, computedGross - grandTotal);
  const totalTaxable = processedItems.reduce((acc, it) => acc + it.taxableValue, 0);
  const totalTax = processedItems.reduce((acc, it) => acc + it.taxAmount, 0);
  const totalCgst = processedItems.reduce((acc, it) => acc + it.cgstAmount, 0);
  const totalSgst = processedItems.reduce((acc, it) => acc + it.sgstAmount, 0);
  const totalIgst = processedItems.reduce((acc, it) => acc + it.igstAmount, 0);

  // Clean Order & Invoice IDs: Use exact order / tracking ID
  const orderDisplayId = String(order.id || "").trim();
  const rawId = String(order.id || "").replace(/[^a-zA-Z0-9]/g, "");
  const invoiceNumber = `INV-MS-2026-${rawId.slice(-6).toUpperCase() || "092104"}`;

  // Date formatting
  const rawDate = order.deliveredAt?.toDate?.() 
    || (order.deliveredAt?.seconds ? new Date(order.deliveredAt.seconds * 1000) : null)
    || order.createdAt?.toDate?.() 
    || (order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) : null)
    || new Date();

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(rawDate);

  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(rawDate);

  return {
    orderId: orderDisplayId,
    originalId: order.id,
    invoiceNumber,
    invoiceDate: formattedDate,
    invoiceTime: formattedTime,
    placeOfSupply: customerState,
    placeOfDelivery: customerState,
    isIntraState,
    customerStateCode,
    items: processedItems,
    grossSubtotal: computedGross,
    discount,
    couponCode: order.couponCode || null,
    totalTaxable: Math.round(totalTaxable * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    totalCgst: Math.round(totalCgst * 100) / 100,
    totalSgst: Math.round(totalSgst * 100) / 100,
    totalIgst: Math.round(totalIgst * 100) / 100,
    shippingFee: 0,
    grandTotal: grandTotal || computedGross,
    totalInWords: numberToWords(grandTotal || computedGross),
    paymentMode: (order.paymentStatus === "Paid" || Boolean(order.razorpayPaymentId)) 
      ? "Prepaid Online (Razorpay)" 
      : "Cash on Delivery (COD)",
    paymentRef: order.razorpayPaymentId || "COD-POST-DELIVERY",
    paymentStatus: (order.paymentStatus === "Paid" || Boolean(order.razorpayPaymentId)) ? "PAID" : "COLLECTED ON DELIVERY",
    customer: {
      name: shipping.name || order.customer || "Valued Patron",
      address: shipping.address || order.address || "Address details on file",
      city: shipping.city || "Kushinagar",
      state: customerState,
      pincode: shipping.pincode || "274402",
      mobile: shipping.mobile || order.phone || "",
      email: shipping.email || order.userEmail || order.email || "info@mahasell.in"
    }
  };
}
