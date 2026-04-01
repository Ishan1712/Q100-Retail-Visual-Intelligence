export const shiftData = {
  workerName: "Rahul",
  greeting: "Good morning",
  shift: "Morning Shift",
  store: "Q-Mart Kothrud, Pune",
  scanned: 4,
  total: 10,
  streakCount: 5,
  restockCompleted: 4,
  restockTotal: 6,
  offline: true,
};

export const shelves = [
  { id: 3, name: "Shelf 3", category: "Staples & Grains", icon: "🌾", status: "green", lastScan: "Scanned 8:15 AM", note: "Compliant", priority: false },
  { id: 5, name: "Shelf 5", category: "Beverages", icon: "🍼", status: "green", lastScan: "Scanned 8:32 AM", note: "Compliant", priority: false },
  { id: 7, name: "Shelf 7", category: "Snacks & Biscuits", icon: "🍪", status: "red", lastScan: "Scanned 8:48 AM", note: "3 OOS items detected · Restock pending", priority: false },
  { id: 9, name: "Shelf 9", category: "Personal Care", icon: "🧼", status: "green", lastScan: "Scanned 9:05 AM", note: "Compliant", priority: false },
  { id: 2, name: "Shelf 2", category: "Dairy & Frozen", icon: "🥛", status: "grey", lastScan: "Last scan 6:22 AM", note: "Not scanned · 3+ hours ago", priority: true },
  { id: 4, name: "Shelf 4", category: "Cooking Oil & Masalas", icon: "🫙", status: "grey", lastScan: "Not scanned yet", note: "Pending scan", priority: false },
  { id: 6, name: "Shelf 6", category: "Household & Cleaning", icon: "🧴", status: "grey", lastScan: "Not scanned yet", note: "Pending scan", priority: false },
  { id: 8, name: "Shelf 8", category: "Baby & Health", icon: "🩺", status: "grey", lastScan: "Not scanned yet", note: "Pending scan", priority: false },
  { id: 10, name: "Shelf 10", category: "Breakfast & Cereals", icon: "🥣", status: "grey", lastScan: "Not scanned yet", note: "Pending scan", priority: false },
  { id: 1, name: "Shelf 1", category: "Checkout Impulse Zone", icon: "🛒", status: "grey", lastScan: "Not scanned yet", note: "Pending scan", priority: false },
];

/* ═══════════════════════════════════════
   PLANOGRAM DATA — Shelf 7: Snacks & Biscuits
   6 sections with shelf-level product data
   ═══════════════════════════════════════ */
/* ═══════════════════════════════════════
   STORE MANAGER DASHBOARD DATA
   Screen 2.1 — Morning Readiness / Store Heatmap
   ═══════════════════════════════════════ */
export const managerStore = {
  name: "Q-Mart Kothrud, Pune",
  date: "Wednesday, 25 March 2026",
  time: "10:15 AM",
  overallCompliance: 84.2,
  complianceYesterday: 78.6,
  totalAisles: 10,
  endCapZones: 2,
  checkoutZones: 1,
  lostSalesPerHour: 1240,
  lostSalesRate: 4.2, // ₹ per minute
};

export const managerAisles = [
  { id: 1,  category: "Checkout Impulse",     compliance: 92, oosItems: 2,  lastScan: "9:45 AM",  color: "lightgreen", icon: "🛒" },
  { id: 2,  category: "Dairy & Frozen",       compliance: 71, oosItems: 8,  lastScan: "9:52 AM",  color: "red",        icon: "🥛" },
  { id: 3,  category: "Staples & Grains",     compliance: 96, oosItems: 1,  lastScan: "8:15 AM",  color: "darkgreen",  icon: "🌾" },
  { id: 4,  category: "Cooking Oil & Masalas", compliance: 88, oosItems: 3,  lastScan: "10:02 AM", color: "lightgreen", icon: "🫙" },
  { id: 5,  category: "Beverages",            compliance: 91, oosItems: 2,  lastScan: "8:32 AM",  color: "lightgreen", icon: "🍼", vip: { brand: "Coca-Cola", type: "End-cap display", rent: "₹15,000/mo" } },
  { id: 6,  category: "Household & Cleaning",  compliance: 74, oosItems: 7,  lastScan: "10:08 AM", color: "amber",      icon: "🧴" },
  { id: 7,  category: "Snacks & Biscuits",    compliance: 79, oosItems: 4,  lastScan: "9:18 AM",  color: "amber",      icon: "🍪", vip: { brand: "Cadbury Dairy Milk Silk", type: "Promotional bay", compliance: 100 } },
  { id: 8,  category: "Baby & Health",        compliance: 94, oosItems: 1,  lastScan: "9:35 AM",  color: "lightgreen", icon: "🩺" },
  { id: 9,  category: "Personal Care",        compliance: 89, oosItems: 3,  lastScan: "9:05 AM",  color: "lightgreen", icon: "🧼" },
  { id: 10, category: "Breakfast & Cereals",  compliance: 87, oosItems: 3,  lastScan: "10:12 AM", color: "lightgreen", icon: "🥣" },
];

export const managerAlerts = [
  {
    id: 1,
    severity: "critical",
    aisle: 2,
    category: "Dairy & Frozen",
    icon: "🥛",
    products: "Mother Dairy Curd 400g OOS, Amul Butter low stock",
    topProduct: "Mother Dairy Curd 400g",
    lossPerHour: 480,
    lastScan: "9:52 AM",
    status: "Restock dispatched, pending",
  },
  {
    id: 2,
    severity: "critical",
    aisle: 6,
    category: "Household & Cleaning",
    icon: "🧴",
    products: "Surf Excel 1kg OOS, Vim Bar low stock, Harpic OOS",
    topProduct: "Surf Excel 1kg",
    lossPerHour: 340,
    lastScan: "10:08 AM",
    status: "Not yet dispatched",
  },
  {
    id: 3,
    severity: "warning",
    aisle: 7,
    category: "Snacks & Biscuits",
    icon: "🍪",
    products: "Parle-G 250g restocking, Kurkure OOS, Dairy Milk low",
    topProduct: "Kurkure Multi Grain",
    lossPerHour: 280,
    lastScan: "9:18 AM",
    status: "Restocking ETA 4 mins",
  },
];

export const managerRestockFeed = [
  { id: 1, time: "10:04 AM", worker: "Manoj",  action: "picking",    product: "Surf Excel 1kg × 5",       target: "Aisle 6",            done: false },
  { id: 2, time: "9:38 AM",  worker: "Manoj",  action: "restocked",  product: "Dairy Milk 50g × 3",       target: "Aisle 7, Section 5",  done: true },
  { id: 3, time: "9:33 AM",  worker: "Suresh", action: "restocking", product: "Kurkure Multi Grain × 6",  target: "Aisle 7, Section 3",  done: false },
  { id: 4, time: "9:31 AM",  worker: "Suresh", action: "restocked",  product: "Parle-G 250g × 4",        target: "Aisle 7, Section 2",  done: true },
];

export const shelf7Sections = [
  {
    id: 1,
    name: "Premium Biscuits",
    icon: "cookie",
    masterImage: "https://upload.wikimedia.org/wikipedia/commons/7/76/Tesco_Supermarket_%28Cakes_%26_Biscuits%29.jpg",
    shelves: {
      top:      ["Britannia Good Day Butter", "Good Day Cashew", "Milano Dark"],
      eyeLevel: ["Britannia 50-50", "Hide & Seek", "Hide & Seek"],
      lower:    ["Sunfeast Dark Fantasy", "Unibic Cookies"],
    },
    expectedProducts: [
      "Britannia Good Day Butter", "Good Day Cashew", "Milano Dark",
      "Britannia 50-50", "Hide & Seek",
      "Sunfeast Dark Fantasy", "Unibic Cookies",
    ],
    result: "pass",
    issues: [],
  },
  {
    id: 2,
    name: "Value Biscuits",
    icon: "cookie",
    masterImage: "https://upload.wikimedia.org/wikipedia/commons/7/76/Tesco_Supermarket_%28Cakes_%26_Biscuits%29.jpg",
    shelves: {
      top:      ["Parle-G 800g Family Pack", "Parle-G 800g", "Parle-G 800g", "Marie Gold 250g"],
      eyeLevel: ["Parle-G 250g", "Parle-G 250g", "Parle-G 250g", "Parle-G 250g", "Parle-G 250g", "Parle-G 250g", "Krackjack", "Krackjack", "Krackjack", "Krackjack"],
      lower:    ["Tiger Glucose", "Glucose-D"],
    },
    expectedProducts: [
      "Parle-G 800g Family Pack", "Parle-G 800g", "Marie Gold 250g",
      "Parle-G 250g (x6)", "Krackjack (x4)",
      "Tiger Glucose", "Glucose-D",
    ],
    result: "fail",
    issues: [
      { type: "oos", product: "Parle-G 250g", detail: "Only 2 of 6 facings present — 4 units OOS", shelf: "eyeLevel", gap: "18cm gap visible", facingsExpected: 6, facingsFound: 2, qtyNeeded: 4 },
    ],
  },
  {
    id: 3,
    name: "Namkeen & Savoury",
    icon: "bowl-food",
    masterImage: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Extra_%28Coop_supermarket%29_Bergen_Storsenter_Norway_2017-11-16_snacks_aisle.jpg",
    shelves: {
      top:      ["Haldiram's Aloo Bhujia 400g", "Moong Dal 200g"],
      eyeLevel: ["Haldiram's Mixture", "Kurkure Multi Grain", "Kurkure Masala Munch"],
      lower:    ["Bikaji Bhujia", "Local brand"],
    },
    expectedProducts: [
      "Haldiram's Aloo Bhujia 400g", "Moong Dal 200g",
      "Haldiram's Mixture", "Kurkure Multi Grain", "Kurkure Masala Munch",
      "Bikaji Bhujia", "Local brand",
    ],
    result: "fail",
    issues: [
      { type: "oos", product: "Kurkure Multi Grain", detail: "Completely OOS — entire slot empty", shelf: "eyeLevel", facingsExpected: 1, facingsFound: 0, qtyNeeded: 6 },
      { type: "misplaced", product: "Shree Ganesh Mixture", detail: "Placed in Kurkure Multi Grain slot", shelf: "eyeLevel", correctLocation: "Lower Shelf, Position 4" },
    ],
  },
  {
    id: 4,
    name: "Chips & Crisps",
    icon: "lightning",
    masterImage: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Potato_Chip_Aisle.jpg",
    shelves: {
      top:      ["Lay's Classic 150g", "Magic Masala 150g"],
      eyeLevel: ["Lay's 52g", "Lay's 52g", "Lay's 52g", "Lay's 52g", "Lay's 52g", "Lay's 52g", "Lay's 52g", "Lay's 52g", "Kurkure Chilli Chatka", "Bingo Mad Angles"],
      lower:    ["Uncle Chipps", "Yellow Diamond"],
    },
    expectedProducts: [
      "Lay's Classic 150g", "Magic Masala 150g",
      "Lay's 52g (x8)", "Kurkure Chilli Chatka", "Bingo Mad Angles",
      "Uncle Chipps", "Yellow Diamond",
    ],
    result: "pass",
    issues: [],
  },
  {
    id: 5,
    name: "Chocolates & Candy",
    icon: "gift",
    masterImage: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Tesco_Supermarket_%28Confectionery%29.jpg",
    shelves: {
      top:      ["Dairy Milk Silk Bubbly", "Silk Roast Almond", "Bournville"],
      eyeLevel: ["Dairy Milk 50g", "Dairy Milk 50g", "Dairy Milk 50g", "Dairy Milk 50g", "Dairy Milk 50g", "Dairy Milk 50g", "Dairy Milk 50g", "Dairy Milk 50g", "5 Star", "5 Star", "5 Star", "5 Star", "5 Star", "5 Star", "Perk", "Perk", "Perk", "Perk"],
      lower:    ["Eclairs", "Mango Bite", "Pulse"],
    },
    expectedProducts: [
      "Dairy Milk Silk Bubbly", "Silk Roast Almond", "Bournville",
      "Dairy Milk 50g (x8)", "5 Star (x6)", "Perk (x4)",
      "Eclairs", "Mango Bite", "Pulse",
    ],
    result: "fail",
    issues: [
      { type: "oos", product: "Dairy Milk 50g", detail: "Only 5 of 8 facings present — 3 units OOS", shelf: "eyeLevel", gap: "Gap between 5 Star and remaining Dairy Milk", facingsExpected: 8, facingsFound: 5, qtyNeeded: 3 },
    ],
  },
  {
    id: 6,
    name: "Health Snacks & Rusks",
    icon: "heart",
    masterImage: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Tesco_Supermarket_%28Crisps%29.jpg",
    shelves: {
      top:      ["NutriChoice Digestive", "NutriChoice Oats"],
      eyeLevel: ["NutriChoice 5 Grain", "Bisk Farm Sugarfree"],
      lower:    ["Britannia Rusk 300g", "Britannia Rusk 300g", "Britannia Rusk 300g", "Britannia Rusk 300g", "Parle Rusk"],
    },
    expectedProducts: [
      "NutriChoice Digestive", "NutriChoice Oats",
      "NutriChoice 5 Grain", "Bisk Farm Sugarfree",
      "Britannia Rusk 300g (x4)", "Parle Rusk",
    ],
    result: "pass",
    issues: [],
  },
];
