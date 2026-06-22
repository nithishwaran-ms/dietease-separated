/**
 * DietEase+ — JSON File Database (no compilation required)
 * Stores data in dietease-data.json beside this file
 */
const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'dietease-data.json');

// ── Default structure ─────────────────────────────────────────────────────────
const DEFAULT = {
  users: {},      // email -> { password, settings: { daily_goal }, food_log: [] }
  products: {},   // barcode -> product object
};

// ── Built-in products ─────────────────────────────────────────────────────────
const BUILTIN = {
  // ── Indian Biscuits & Snacks ───────────────────────────────────────────────
  '8901719100018': { name:'Parle-G Biscuits',         brand:'Parle',       calories:450, protein:6.7,  carbs:76,   fat:11.7, source:'⚡ Built-in DB' },
  '8901719110017': { name:'Parle Hide & Seek',         brand:'Parle',       calories:496, protein:6.2,  carbs:66,   fat:23,   source:'⚡ Built-in DB' },
  '8901030810054': { name:'Parle-G Gold',               brand:'Parle',       calories:450, protein:6.7,  carbs:76,   fat:11.7, source:'⚡ Built-in DB' },
  '8901719114626': { name:'Parle Monaco',               brand:'Parle',       calories:430, protein:8,    carbs:67,   fat:14,   source:'⚡ Built-in DB' },
  '8901030008503': { name:'Parle Krackjack',            brand:'Parle',       calories:425, protein:7,    carbs:68,   fat:13,   source:'⚡ Built-in DB' },
  '8901063032019': { name:'Britannia Good Day',         brand:'Britannia',   calories:503, protein:7,    carbs:64,   fat:24,   source:'⚡ Built-in DB' },
  '8901063030015': { name:'Britannia Marie Gold',       brand:'Britannia',   calories:416, protein:8,    carbs:74,   fat:9,    source:'⚡ Built-in DB' },
  '8901063052048': { name:'Britannia Tiger',            brand:'Britannia',   calories:429, protein:7,    carbs:72,   fat:12,   source:'⚡ Built-in DB' },
  '8901063990031': { name:'Britannia NutriChoice',      brand:'Britannia',   calories:451, protein:9,    carbs:65,   fat:17,   source:'⚡ Built-in DB' },
  '8901063050020': { name:'Britannia Bourbon',          brand:'Britannia',   calories:477, protein:5.5,  carbs:68,   fat:20,   source:'⚡ Built-in DB' },
  '8904004400019': { name:'Sunfeast Dark Fantasy',      brand:'ITC',         calories:517, protein:6.5,  carbs:64,   fat:26,   source:'⚡ Built-in DB' },
  '8904004760010': { name:'Sunfeast Bounce',            brand:'ITC',         calories:480, protein:6,    carbs:68,   fat:20,   source:'⚡ Built-in DB' },
  // ── Indian Noodles & Instant Food ─────────────────────────────────────────
  '8901058851336': { name:'Maggi 2-Min Noodles',        brand:'Nestlé',      calories:375, protein:9.4,  carbs:57,   fat:12.2, source:'⚡ Built-in DB' },
  '8901058853620': { name:'Maggi Atta Noodles',         brand:'Nestlé',      calories:350, protein:11,   carbs:63,   fat:4,    source:'⚡ Built-in DB' },
  '8901058854801': { name:'Maggi Masala Oats',          brand:'Nestlé',      calories:374, protein:13,   carbs:66,   fat:5,    source:'⚡ Built-in DB' },
  '8901058000563': { name:'Nestlé Munch',               brand:'Nestlé',      calories:445, protein:6,    carbs:63,   fat:20,   source:'⚡ Built-in DB' },
  // ── Amul Dairy ────────────────────────────────────────────────────────────
  '8901088002230': { name:'Amul Butter',                brand:'Amul',        calories:720, protein:0.5,  carbs:0,    fat:80,   source:'⚡ Built-in DB' },
  '8901088000885': { name:'Amul Taaza Milk',            brand:'Amul',        calories:58,  protein:3.2,  carbs:4.8,  fat:3,    source:'⚡ Built-in DB' },
  '8901088012007': { name:'Amul Cheese Slice',          brand:'Amul',        calories:300, protein:18,   carbs:4,    fat:24,   source:'⚡ Built-in DB' },
  '8901088012205': { name:'Amul Shrikhand',             brand:'Amul',        calories:185, protein:4.5,  carbs:30,   fat:5,    source:'⚡ Built-in DB' },
  '8901088500028': { name:'Amul Lassi 200ml',           brand:'Amul',        calories:132, protein:4,    carbs:22,   fat:3,    source:'⚡ Built-in DB' },
  '8901058200203': { name:'Amul Gold Milk',             brand:'Amul',        calories:67,  protein:3.3,  carbs:4.5,  fat:3.5,  source:'⚡ Built-in DB' },
  '8901058200104': { name:'Amul Masti Dahi',            brand:'Amul',        calories:60,  protein:4,    carbs:5,    fat:2.5,  source:'⚡ Built-in DB' },
  // ── Indian Chips & Namkeen ────────────────────────────────────────────────
  '8901491502759': { name:"Lay's Classic Salted",       brand:"Lay's",       calories:536, protein:6.2,  carbs:52.3, fat:34,   source:'⚡ Built-in DB' },
  '8901491107474': { name:"Lay's Magic Masala",         brand:"Lay's",       calories:547, protein:6.4,  carbs:54,   fat:33,   source:'⚡ Built-in DB' },
  '8901491100109': { name:'Kurkure Masala Munch',       brand:'PepsiCo',     calories:537, protein:6.7,  carbs:58,   fat:30,   source:'⚡ Built-in DB' },
  '8902045000018': { name:'Haldirams Bhujia',           brand:'Haldirams',   calories:536, protein:12,   carbs:56,   fat:28,   source:'⚡ Built-in DB' },
  '8902045010239': { name:'Haldirams Aloo Bhujia',      brand:'Haldirams',   calories:543, protein:14,   carbs:56,   fat:28,   source:'⚡ Built-in DB' },
  '8902045010024': { name:'Haldirams Navratan Mix',     brand:'Haldirams',   calories:490, protein:10,   carbs:56,   fat:24,   source:'⚡ Built-in DB' },
  '8901585001030': { name:'Bingo Mad Angles',           brand:'ITC',         calories:520, protein:7,    carbs:64,   fat:26,   source:'⚡ Built-in DB' },
  '8906001110015': { name:'Uncle Chips Spicy Treat',    brand:'PepsiCo',     calories:532, protein:6,    carbs:55,   fat:32,   source:'⚡ Built-in DB' },
  // ── Indian Chocolates ─────────────────────────────────────────────────────
  '7622210449283': { name:'Cadbury Dairy Milk',         brand:'Cadbury',     calories:534, protein:7.7,  carbs:57.6, fat:29.7, source:'⚡ Built-in DB' },
  '7622210979063': { name:'Cadbury 5 Star',             brand:'Cadbury',     calories:462, protein:4,    carbs:70,   fat:18,   source:'⚡ Built-in DB' },
  '7622210616784': { name:'Cadbury Dairy Milk Silk',    brand:'Cadbury',     calories:555, protein:7.5,  carbs:60,   fat:32,   source:'⚡ Built-in DB' },
  '8901087068011': { name:'Cadbury Bournville',         brand:'Cadbury',     calories:530, protein:5,    carbs:55,   fat:32,   source:'⚡ Built-in DB' },
  '8901058501203': { name:'KitKat 4 Finger',            brand:'Nestlé',      calories:518, protein:6.3,  carbs:63,   fat:27,   source:'⚡ Built-in DB' },
  '8901058013613': { name:'Nestlé Milkybar',            brand:'Nestlé',      calories:538, protein:9,    carbs:58,   fat:29.5, source:'⚡ Built-in DB' },
  // ── Indian Beverages ──────────────────────────────────────────────────────
  '8901552004123': { name:'Coca-Cola 250ml',            brand:'Coca-Cola',   calories:44,  protein:0,    carbs:11,   fat:0,    source:'⚡ Built-in DB' },
  '8901552009050': { name:'Thums Up 250ml',             brand:'Coca-Cola',   calories:44,  protein:0,    carbs:11,   fat:0,    source:'⚡ Built-in DB' },
  '8901552012455': { name:'Sprite 250ml',               brand:'Coca-Cola',   calories:36,  protein:0,    carbs:9,    fat:0,    source:'⚡ Built-in DB' },
  '8901552004819': { name:'Limca 250ml',                brand:'Coca-Cola',   calories:38,  protein:0,    carbs:9.5,  fat:0,    source:'⚡ Built-in DB' },
  '8901552010741': { name:'Maaza Mango 250ml',          brand:'Coca-Cola',   calories:115, protein:0,    carbs:28,   fat:0,    source:'⚡ Built-in DB' },
  '8901012000016': { name:'Pepsi 250ml',                brand:'PepsiCo',     calories:42,  protein:0,    carbs:10.6, fat:0,    source:'⚡ Built-in DB' },
  '8901012009316': { name:'Mountain Dew 250ml',         brand:'PepsiCo',     calories:48,  protein:0,    carbs:12,   fat:0,    source:'⚡ Built-in DB' },
  '8901012004169': { name:'Mirinda Orange 250ml',       brand:'PepsiCo',     calories:46,  protein:0,    carbs:11.5, fat:0,    source:'⚡ Built-in DB' },
  '8901012002080': { name:'Slice Mango 250ml',          brand:'PepsiCo',     calories:113, protein:0,    carbs:28,   fat:0,    source:'⚡ Built-in DB' },
  '8906002280036': { name:'Frooti Mango 200ml',         brand:'Parle Agro',  calories:84,  protein:0,    carbs:21,   fat:0,    source:'⚡ Built-in DB' },
  '8906002210010': { name:'Appy Fizz 250ml',            brand:'Parle Agro',  calories:110, protein:0,    carbs:27.5, fat:0,    source:'⚡ Built-in DB' },
  '8906003400040': { name:'Yakult 65ml',                brand:'Yakult',      calories:50,  protein:0.8,  carbs:11.6, fat:0,    source:'⚡ Built-in DB' },
  // ── Indian Cereals & Health Drinks ────────────────────────────────────────
  '8901499000018': { name:"Kellogg's Cornflakes",       brand:"Kellogg's",   calories:357, protein:8,    carbs:79,   fat:1,    source:'⚡ Built-in DB' },
  '8901499011007': { name:"Kellogg's Chocos",           brand:"Kellogg's",   calories:385, protein:8,    carbs:77,   fat:3.5,  source:'⚡ Built-in DB' },
  '8901499013001': { name:"Kellogg's Special K",        brand:"Kellogg's",   calories:375, protein:14,   carbs:70,   fat:2.5,  source:'⚡ Built-in DB' },
  '8901087085421': { name:'Bournvita (per 7.5g)',       brand:'Cadbury',     calories:28,  protein:0.5,  carbs:6,    fat:0.1,  source:'⚡ Built-in DB' },
  '8901058503009': { name:'Horlicks (per 25g)',         brand:"GSK",         calories:97,  protein:2.2,  carbs:18.5, fat:1.8,  source:'⚡ Built-in DB' },
  // ── International Chocolates & Candy ──────────────────────────────────────
  '0040000483717': { name:'Snickers Bar',               brand:'Mars',        calories:488, protein:8.1,  carbs:60.5, fat:23,   source:'⚡ Built-in DB' },
  '0040000529774': { name:'Mars Bar',                   brand:'Mars',        calories:453, protein:4.3,  carbs:67,   fat:18,   source:'⚡ Built-in DB' },
  '0040000432395': { name:'Twix Bar',                   brand:'Mars',        calories:495, protein:4.5,  carbs:64,   fat:24,   source:'⚡ Built-in DB' },
  '0040000001560': { name:'M&Ms Milk Chocolate',        brand:'Mars',        calories:480, protein:4.5,  carbs:73,   fat:20,   source:'⚡ Built-in DB' },
  '0034000002054': { name:'Reese\'s Peanut Butter Cup', brand:'Hershey\'s',  calories:515, protein:10,   carbs:56,   fat:29,   source:'⚡ Built-in DB' },
  '3017620422003': { name:'Nutella (per 100g)',         brand:'Ferrero',     calories:547, protein:6.3,  carbs:57.5, fat:31.6, source:'⚡ Built-in DB' },
  '7613035604308': { name:'KitKat (Swiss)',             brand:'Nestlé',      calories:518, protein:6.3,  carbs:63,   fat:27,   source:'⚡ Built-in DB' },
  '0034000024100': { name:'Hershey\'s Milk Chocolate',  brand:'Hershey\'s',  calories:535, protein:7.5,  carbs:60,   fat:30,   source:'⚡ Built-in DB' },
  // ── International Chips & Snacks ──────────────────────────────────────────
  '0038000845321': { name:"Kellogg's Corn Flakes (US)", brand:"Kellogg's",   calories:357, protein:8,    carbs:79,   fat:0.5,  source:'⚡ Built-in DB' },
  '0037600164801': { name:'Oreo Cookies (US)',          brand:'Nabisco',     calories:471, protein:5,    carbs:70,   fat:20,   source:'⚡ Built-in DB' },
  '0028400090032': { name:'Cheetos Crunchy',            brand:'Frito-Lay',   calories:526, protein:7,    carbs:54,   fat:31,   source:'⚡ Built-in DB' },
  '0028400083690': { name:'Doritos Nacho Cheese',       brand:'Frito-Lay',   calories:484, protein:6,    carbs:64,   fat:22,   source:'⚡ Built-in DB' },
  '0038000141546': { name:'Pringles Original',          brand:'Pringles',    calories:524, protein:5,    carbs:55,   fat:30,   source:'⚡ Built-in DB' },
  '0038000138416': { name:'Pringles Sour Cream & Onion',brand:'Pringles',    calories:524, protein:5,    carbs:55,   fat:30,   source:'⚡ Built-in DB' },
  '0072250012011': { name:"Lay's Classic (US)",         brand:"Lay's",       calories:536, protein:7,    carbs:53,   fat:34,   source:'⚡ Built-in DB' },
  // ── International Cereals & Bars ──────────────────────────----------------------------------------------------------------
  '0016000275201': { name:'Cheerios',                   brand:'General Mills',calories:357, protein:10,   carbs:73,   fat:4,    source:'⚡ Built-in DB' },
  '0016000494800': { name:'Lucky Charms',               brand:'General Mills',calories:379, protein:8,    carbs:80,   fat:4,    source:'⚡ Built-in DB' },
  '0030000067857': { name:'Quaker Oats',                brand:'Quaker',      calories:371, protein:13,   carbs:67,   fat:7,    source:'⚡ Built-in DB' },
  '0072470558022': { name:'Nature Valley Oats & Honey', brand:'General Mills',calories:471, protein:9,    carbs:71,   fat:17,   source:'⚡ Built-in DB' },
  '0051000012517': { name:'Pop-Tarts Strawberry',       brand:'Kellogg\'s',  calories:385, protein:4,    carbs:73,   fat:8,    source:'⚡ Built-in DB' },
  // ── Peanut Butter ────────────────────────────────────────────────────────
  '0048001000000': { name:'Skippy Peanut Butter',       brand:'Skippy',      calories:590, protein:22,   carbs:21,   fat:50,   source:'⚡ Built-in DB' },
  '0051500751206': { name:'Jif Peanut Butter',          brand:'Jif',         calories:596, protein:22,   carbs:21,   fat:51,   source:'⚡ Built-in DB' },
  // ── International Beverages ───────────────────────────────────────────────
  '049000050103':  { name:'Coca-Cola Classic (US)',     brand:'Coca-Cola',   calories:42,  protein:0,    carbs:10.6, fat:0,    source:'⚡ Built-in DB' },
  '049000028904':  { name:'Sprite (US) 355ml',          brand:'Coca-Cola',   calories:45,  protein:0,    carbs:11.3, fat:0,    source:'⚡ Built-in DB' },
  '012000001086':  { name:'Pepsi (US) 355ml',           brand:'PepsiCo',     calories:45,  protein:0,    carbs:11.3, fat:0,    source:'⚡ Built-in DB' },
  '012000010781':  { name:'Mountain Dew (US) 355ml',    brand:'PepsiCo',     calories:57,  protein:0,    carbs:15,   fat:0,    source:'⚡ Built-in DB' },
  '049000028942':  { name:'Fanta Orange (US)',          brand:'Coca-Cola',   calories:45,  protein:0,    carbs:11.3, fat:0,    source:'⚡ Built-in DB' },
  '078000000107':  { name:'Red Bull 250ml',             brand:'Red Bull',    calories:112, protein:0.5,  carbs:28,   fat:0,    source:'⚡ Built-in DB' },
  '070847013557':  { name:'Monster Energy 473ml',       brand:'Monster',     calories:100, protein:0,    carbs:27,   fat:0,    source:'⚡ Built-in DB' },
  '052000047965':  { name:'Gatorade Lemon-Lime',        brand:'Gatorade',    calories:130, protein:0,    carbs:34,   fat:0,    source:'⚡ Built-in DB' },
  '030000067857':  { name:'Tropicana Orange Juice',     brand:'Tropicana',   calories:112, protein:1.7,  carbs:26,   fat:0.3,  source:'⚡ Built-in DB' },
  // ── Dairy & Yogurt (International) ────────────────────────────────────────
  '021000009091':  { name:'Dannon Greek Yogurt Plain',  brand:'Dannon',      calories:100, protein:17,   carbs:7,    fat:0,    source:'⚡ Built-in DB' },
  '070640010609':  { name:'Chobani Greek Yogurt Plain', brand:'Chobani',     calories:92,  protein:17,   carbs:6,    fat:0.5,  source:'⚡ Built-in DB' },
};


// ── Load or create data file ──────────────────────────────────────────────────
function load() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    
    // Check if migration to users list is needed
    if (!data.users) {
      data.users = {};
      // If there's old flat data, migrate it to guest@dietease.com
      if (data.food_log || data.settings) {
        data.users['guest@dietease.com'] = {
          password: 'password', // default password
          settings: data.settings || { daily_goal: 2000 },
          food_log: data.food_log || []
        };
      }
    }
    
    // Clean up legacy flat keys
    delete data.food_log;
    delete data.settings;
    
    // Merge built-ins (don't overwrite user-cached products)
    if (!data.products) data.products = {};
    for (const [k, v] of Object.entries(BUILTIN)) {
      if (!data.products[k]) data.products[k] = { ...v, barcode: k };
    }
    
    save(data);
    return data;
  } catch {
    const data = { users: {}, products: {} };
    for (const [k, v] of Object.entries(BUILTIN)) {
      data.products[k] = { ...v, barcode: k };
    }
    save(data);
    return data;
  }
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── Export DB interface ───────────────────────────────────────────────────────
module.exports = { load, save };
