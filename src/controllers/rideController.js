const Ride = require("../models/Ride");
const User = require("../models/User");

// Create Ride
const createRide = async (req, res) => {
  try {
    const { pickup, destination, fare } = req.body;

    // Validate input
    if (
      !pickup?.trim() ||
      !destination?.trim() ||
      fare == null ||
      !Number.isFinite(Number(fare)) ||
      Number(fare) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ride details",
      });
    }

    // Create a new ride
    const ride = new Ride({
      pickup: pickup.trim(),
      destination: destination.trim(),
      fare: Number(fare),
      passenger: req.user.id,
    });

    // Save ride in MongoDB
    await ride.save();

    // Send response
    return res.status(201).json({
      success: true,
      message: "Ride created successfully",
      ride,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All My Rides
const getMyRides = async (req, res) => {
    try {
        const rides = await Ride.find({
            passenger: req.user.id,
        }).sort({
            createdAt: -1,
        });

        res.json({
            success: true,
            total: rides.length,
            rides,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// Get Single Ride
const getRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found",
            });
        }

        res.json({
            success: true,
            ride,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// Update Ride Status
// Update Ride Status
const updateRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found",
            });
        }

        if (ride.passenger.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        const newStatus = req.body.status;

        const allowedTransitions = {
            requested: ["accepted", "cancelled"],
            accepted: ["completed", "cancelled"],
            completed: [],
            cancelled: [],
        };

        if (!allowedTransitions[ride.status].includes(newStatus)) {
            return res.status(400).json({
                message: `Cannot change ride status from ${ride.status} to ${newStatus}`,
            });
        }

        ride.status = newStatus;

        await ride.save();

        res.json({
            success: true,
            message: "Ride status updated successfully",
            ride,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// Delete Ride
const deleteRide = async (req, res) => {
    try {

        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found",
            });
        }

        if (ride.passenger.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        await Ride.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Ride deleted successfully",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};


// Accept Ride
const acceptRide = async (req, res) => {
    try {
        // Check logged-in user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Only drivers can accept rides
        if (user.role !== "driver") {
            return res.status(403).json({
                message: "Only drivers can accept rides",
            });
        }

        // Find ride
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found",
            });
        }

        // Ride must be requested
        if (ride.status !== "requested") {
            return res.status(400).json({
                message: "Ride is not available for acceptance",
            });
        }

        // Check if another driver already accepted it
        if (ride.driver) {
            return res.status(400).json({
                message: "Ride already has a driver",
            });
        }

        // Assign driver
        ride.driver = user._id;

        // Change ride status
        ride.status = "accepted";

        // Save changes
        await ride.save();

        res.json({
            success: true,
            message: "Ride accepted successfully",
            ride,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// Get Available Rides for Drivers
const getAvailableRides = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.role !== "driver") {
            return res.status(403).json({
                message: "Only drivers can view available rides",
            });
        }

        const rides = await Ride.find({
            status: "requested",
            driver: null,
        }).sort({
            createdAt: -1,
        });

        res.json({
            success: true,
            total: rides.length,
            rides,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};


module.exports = {
    createRide,
    getMyRides,
    getRide,
    updateRide,
    deleteRide,
     acceptRide,
        getAvailableRides,
};