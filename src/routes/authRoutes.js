const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

// Import FIRST
const {
    register,
    login,
    profile,
} = require("../controllers/authController");

// Routes
router.post("/register", register);
router.post("/login", login);

router.get("/me", auth, profile);


module.exports = router;