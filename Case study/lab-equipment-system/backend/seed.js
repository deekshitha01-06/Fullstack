// Loads sample (synthetic) equipment records:  npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const Equipment = require("./models/Equipment");

const sample = [
  { equipmentCode: "EQ-ELC-101", name: "Digital Oscilloscope", category: "Electronics", unitCost: 42000, quantity: 4, supplier: "Sai Scientific Traders", lab: "Electronics Lab" },
  { equipmentCode: "EQ-ELC-102", name: "Function Generator", category: "Electronics", unitCost: 18500, quantity: 6, supplier: "Sai Scientific Traders", lab: "Electronics Lab" },
  { equipmentCode: "EQ-CMP-201", name: "Desktop Computer", category: "Computing", unitCost: 38000, quantity: 30, supplier: "Vision Computers", lab: "Computer Lab" },
  { equipmentCode: "EQ-CMP-202", name: "Network Switch 24-Port", category: "Computing", unitCost: 12000, quantity: 5, supplier: "Vision Computers", lab: "Networks Lab" },
  { equipmentCode: "EQ-MSR-301", name: "Vernier Caliper", category: "Measuring", unitCost: 850, quantity: 25, supplier: "Lakshmi Lab Supplies", lab: "Physics Lab" },
  { equipmentCode: "EQ-MSR-302", name: "Digital Multimeter", category: "Measuring", unitCost: 1800, quantity: 20, supplier: "Lakshmi Lab Supplies", lab: "Electronics Lab" }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME || "lab_equipment_db" });
    await Equipment.init();
    await Equipment.deleteMany({});
    const inserted = await Equipment.insertMany(sample);
    console.log(`Inserted ${inserted.length} sample equipment records`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
