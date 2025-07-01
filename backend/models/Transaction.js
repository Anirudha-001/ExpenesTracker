const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  type: { type: String, enum: ["Income", "Expense"] },
  category: String,
  description: String,
  date: Date,
});

module.exports = mongoose.model("Transaction", transactionSchema);
