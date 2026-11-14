const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    equipmentCode: {
      type: String,
      required: [true, "Equipment code is required"],
      unique: true, // creates a unique index on equipmentCode
      trim: true,
      uppercase: true
    },
    name: { type: String, required: [true, "Equipment name is required"], trim: true },
    category: { type: String, required: [true, "Category is required"], trim: true },
    unitCost: {
      type: Number,
      required: [true, "Unit cost is required"],
      min: [0, "Unit cost cannot be negative"]
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      validate: { validator: Number.isInteger, message: "Quantity must be a whole number" }
    },
    supplier: { type: String, required: [true, "Supplier is required"], trim: true },
    lab: { type: String, required: [true, "Lab / location is required"], trim: true }
  },
  { timestamps: true, collection: "equipment" }
);

// Secondary index to speed up category-based filtering and grouping
equipmentSchema.index({ category: 1 });

module.exports = mongoose.model("Equipment", equipmentSchema);
