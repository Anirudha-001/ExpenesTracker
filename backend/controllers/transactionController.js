const Transaction = require("../models/Transaction");

exports.addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({ ...req.body, userId: req.user.id });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Failed to add transaction" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Failed to get transactions" });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update transaction" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    let income = 0;
    let expense = 0;

    const categorySummary = {};
    const monthly = {};
    const monthlyCategorySummary = {}; // ✅ new

    // Loop through transactions
    transactions.forEach((t) => {
      // Monthly string e.g., "2025-07"
      const month = new Date(t.date).toISOString().slice(0, 7);

      // Total income/expense
      if (t.type === "Income") {
        income += t.amount;
      } else {
        expense += t.amount;
      }

      // Category summary (total)
      categorySummary[t.category] = (categorySummary[t.category] || 0) + t.amount;

      // Monthly total
      monthly[month] = (monthly[month] || 0) + (t.type === "Income" ? t.amount : -t.amount);

      // Monthly category breakdown
      if (!monthlyCategorySummary[month]) {
        monthlyCategorySummary[month] = {};
      }
      monthlyCategorySummary[month][t.category] =
        (monthlyCategorySummary[month][t.category] || 0) + t.amount;
    });

    const total = income - expense;

    // Calculate category percentage
    const totalCategoryAmount = Object.values(categorySummary).reduce((a, b) => a + b, 0);
    const categoryPercentages = {};
    for (const [cat, amount] of Object.entries(categorySummary)) {
      categoryPercentages[cat] = ((amount / totalCategoryAmount) * 100).toFixed(1);
    }

    // Final response
    res.json({
      income,
      expense,
      total,
      categorySummary,
      categoryPercentages,
      monthly,
      monthlyCategorySummary, // ✅ for frontend: separate pie per month
    });
  } catch (err) {
    console.error("Summary Error:", err.message);
    res.status(500).json({ message: "Failed to generate summary" });
  }
};
