// MongoDB Shell script. Run with:
//   mongosh "<your-connection-string>" --file mongo/queries.js
// Every result is printed so the output can be captured as a screenshot.

const labDb = db.getSiblingDB("lab_equipment_db");

// 1. Create the collection (starting clean for repeatable runs)
labDb.equipment.drop();
labDb.createCollection("equipment");

// 2. Indexes
labDb.equipment.createIndex({ equipmentCode: 1 }, { unique: true });
labDb.equipment.createIndex({ category: 1 });
print("--- Indexes ---");
printjson(labDb.equipment.getIndexes());

// 3. Insert sample documents
labDb.equipment.insertMany([
  { equipmentCode: "EQ-ELC-101", name: "Digital Oscilloscope", category: "Electronics", unitCost: 42000, quantity: 4, supplier: "Sai Scientific Traders", lab: "Electronics Lab" },
  { equipmentCode: "EQ-ELC-102", name: "Function Generator", category: "Electronics", unitCost: 18500, quantity: 6, supplier: "Sai Scientific Traders", lab: "Electronics Lab" },
  { equipmentCode: "EQ-CMP-201", name: "Desktop Computer", category: "Computing", unitCost: 38000, quantity: 30, supplier: "Vision Computers", lab: "Computer Lab" },
  { equipmentCode: "EQ-CMP-202", name: "Network Switch 24-Port", category: "Computing", unitCost: 12000, quantity: 5, supplier: "Vision Computers", lab: "Networks Lab" },
  { equipmentCode: "EQ-MSR-301", name: "Vernier Caliper", category: "Measuring", unitCost: 850, quantity: 25, supplier: "Lakshmi Lab Supplies", lab: "Physics Lab" },
  { equipmentCode: "EQ-MSR-302", name: "Digital Multimeter", category: "Measuring", unitCost: 1800, quantity: 20, supplier: "Lakshmi Lab Supplies", lab: "Electronics Lab" }
]);

// 4. CRUD
print("--- CREATE ---");
printjson(labDb.equipment.insertOne({ equipmentCode: "EQ-ELC-103", name: "Bench Power Supply", category: "Electronics", unitCost: 9500, quantity: 8, supplier: "Sai Scientific Traders", lab: "Electronics Lab" }));

print("--- READ (Electronics) ---");
printjson(labDb.equipment.find({ category: "Electronics" }).toArray());

print("--- READ (quantity below 10) ---");
printjson(labDb.equipment.find({ quantity: { $lt: 10 } }).toArray());

print("--- READ (sorted by unitCost, highest first) ---");
printjson(labDb.equipment.find({}, { _id: 0, equipmentCode: 1, name: 1, unitCost: 1 }).sort({ unitCost: -1 }).toArray());

print("--- UPDATE ---");
printjson(labDb.equipment.updateOne({ equipmentCode: "EQ-ELC-103" }, { $set: { quantity: 10 } }));

print("--- DELETE ---");
printjson(labDb.equipment.deleteOne({ equipmentCode: "EQ-ELC-103" }));

print("--- COUNT ---");
print(labDb.equipment.countDocuments({}));

// 5. Aggregation: category-wise count, total units and inventory value
print("--- AGGREGATION ---");
printjson(
  labDb.equipment.aggregate([
    {
      $group: {
        _id: "$category",
        equipmentCount: { $sum: 1 },
        totalUnits: { $sum: "$quantity" },
        inventoryValue: { $sum: { $multiply: ["$unitCost", "$quantity"] } }
      }
    },
    { $sort: { inventoryValue: -1 } }
  ]).toArray()
);

// 6. Proof that the category index is used
print("--- EXPLAIN (category lookup) ---");
const plan = labDb.equipment.find({ category: "Computing" }).explain("queryPlanner");
printjson(plan.queryPlanner.winningPlan);
