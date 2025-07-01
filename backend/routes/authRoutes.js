const express = require("express");
const { login, register } = require("../controllers/authControllers");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, async (req, res) => {
  try {
    res.json(req.user); 
  } catch (err) {
    res.status(500).json({ message: "Failed to get user" });
  }
});

module.exports = router;
