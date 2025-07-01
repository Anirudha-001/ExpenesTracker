const express = require("express");
const auth = require("../middleware/auth");
const {
  addTransaction, getTransactions, updateTransaction, deleteTransaction, getSummary
} = require("../controllers/transactionController");

const router = express.Router();

router.use(auth);
router.post("/", addTransaction);
router.get("/", getTransactions);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary", getSummary);

module.exports = router;
