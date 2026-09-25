const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    createRide,
    getMyRides,
    getRide,
    updateRide,
    deleteRide,
      acceptRide,
        getAvailableRides
} = require("../controllers/rideController");

router.post("/", auth, createRide);

router.get("/", auth, getMyRides);
router.get("/available", auth, getAvailableRides);

router.get("/:id", auth, getRide);

router.put("/:id", auth, updateRide);
router.put("/:id/accept", auth, acceptRide);

router.delete("/:id", auth, deleteRide);

module.exports = router;