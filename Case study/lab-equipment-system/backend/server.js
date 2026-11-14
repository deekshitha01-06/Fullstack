require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Equipment = require("./models/Equipment");

const app = express();
app.use(express.json());

// Only the listed frontend origins may call this API (comma separated in .env)
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""));
app.use(cors({ origin: allowedOrigins }));

// Converts database errors into clear HTTP responses
function sendError(res, err, fallbackMessage) {
  if (err.code === 11000) {
    return res.status(409).json({ message: "Equipment code already exists" });
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id or value format" });
  }
  console.error(err);
  return res.status(500).json({ message: fallbackMessage });
}

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------- Basic routes ----------
app.get("/", (req, res) => res.json({ message: "Laboratory Equipment API", health: "/api/health" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Laboratory Equipment API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// ---------- CRUD routes ----------
// READ (all, with optional ?search= and ?category=)
app.get("/api/equipment", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = String(req.query.category);
    if (req.query.search) {
      filter.name = { $regex: escapeRegex(String(req.query.search)), $options: "i" };
    }
    const items = await Equipment.find(filter).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    sendError(res, err, "Unable to retrieve equipment");
  }
});

// READ (one)
app.get("/api/equipment/:id", async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Equipment not found" });
    res.json(item);
  } catch (err) {
    sendError(res, err, "Unable to retrieve equipment");
  }
});

// CREATE
app.post("/api/equipment", async (req, res) => {
  try {
    const item = await Equipment.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    sendError(res, err, "Unable to add equipment");
  }
});

// UPDATE
app.put("/api/equipment/:id", async (req, res) => {
  try {
    const item = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ message: "Equipment not found" });
    res.json(item);
  } catch (err) {
    sendError(res, err, "Unable to update equipment");
  }
});

// DELETE
app.delete("/api/equipment/:id", async (req, res) => {
  try {
    const item = await Equipment.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Equipment not found" });
    res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    sendError(res, err, "Unable to delete equipment");
  }
});

// ---------- Aggregation reports ----------
// Category-wise count, total units and inventory value
app.get("/api/reports/category-summary", async (req, res) => {
  try {
    const summary = await Equipment.aggregate([
      {
        $group: {
          _id: "$category",
          equipmentCount: { $sum: 1 },
          totalUnits: { $sum: "$quantity" },
          inventoryValue: { $sum: { $multiply: ["$unitCost", "$quantity"] } }
        }
      },
      { $sort: { inventoryValue: -1 } }
    ]);
    res.json(summary);
  } catch (err) {
    sendError(res, err, "Unable to generate category summary");
  }
});

// Overall totals for the dashboard cards
app.get("/api/reports/overview", async (req, res) => {
  try {
    const [overview] = await Equipment.aggregate([
      {
        $group: {
          _id: null,
          totalEquipment: { $sum: 1 },
          totalUnits: { $sum: "$quantity" },
          inventoryValue: { $sum: { $multiply: ["$unitCost", "$quantity"] } }
        }
      },
      { $project: { _id: 0 } }
    ]);
    res.json(overview || { totalEquipment: 0, totalUnits: 0, inventoryValue: 0 });
  } catch (err) {
    sendError(res, err, "Unable to generate overview");
  }
});

// ---------- Start server after connecting to MongoDB ----------
const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Copy .env.example to .env and fill it in.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "lab_equipment_db"
    });
    await Equipment.init(); // make sure the indexes exist
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}

start();
