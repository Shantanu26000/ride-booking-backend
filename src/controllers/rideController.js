const Ride = require("../models/Ride");
const User = require("../models/User");
const mongoose = require("mongoose");
const axios = require("axios");
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
// Create Ride
const createRide = async (req, res) => {
  try {
    const {
    pickup,
    destination,
    pickupLocation,
    destinationLocation
} = req.body;
if (
    !pickup?.trim() ||
    !destination?.trim() ||
    !pickupLocation ||
    !destinationLocation ||
    !Number.isFinite(Number(pickupLocation.latitude)) ||
    !Number.isFinite(Number(pickupLocation.longitude)) ||
    !Number.isFinite(Number(destinationLocation.latitude)) ||
    !Number.isFinite(Number(destinationLocation.longitude)) ||
    Number(pickupLocation.latitude) < -90 ||
    Number(pickupLocation.latitude) > 90 ||
    Number(destinationLocation.latitude) < -90 ||
    Number(destinationLocation.latitude) > 90 ||
    Number(pickupLocation.longitude) < -180 ||
    Number(pickupLocation.longitude) > 180 ||
    Number(destinationLocation.longitude) < -180 ||
    Number(destinationLocation.longitude) > 180
) {
    return res.status(400).json({
        success: false,
        message: "Invalid ride details",
    });
}


    const distance = calculateDistance(
    Number(pickupLocation.latitude),
    Number(pickupLocation.longitude),
    Number(destinationLocation.latitude),
    Number(destinationLocation.longitude)
);
const mlResponse = await axios.post(
    "http://127.0.0.1:5001/predict",
    {
        distance: distance
    }
);

const fare = mlResponse.data.predictedFare;

    // Create a new ride
  const ride = new Ride({
    pickup: pickup.trim(),
    pickupLocation: {
        latitude: Number(pickupLocation.latitude),
        longitude: Number(pickupLocation.longitude),
    },

    destination: destination.trim(),
    destinationLocation: {
        latitude: Number(destinationLocation.latitude),
        longitude: Number(destinationLocation.longitude),
    },
     distance: distance,
    fare: fare,
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

       if (
    ride.passenger.toString() !== req.user.id &&
    (!ride.driver || ride.driver.toString() !== req.user.id)
) {
    return res.status(403).json({
        message: "Unauthorized",
    });
}

        const newStatus = req.body.status;
        const user = await User.findById(req.user.id);

if (!user) {
    return res.status(404).json({
        message: "User not found",
    });
}

if (user.role === "passenger") {
    if (newStatus !== "cancelled") {
        return res.status(403).json({
            message: "Passenger can only cancel a ride",
        });
    }
}

if (user.role === "driver") {
    if (newStatus !== "completed" && newStatus !== "cancelled") {
        return res.status(403).json({
            message: "Driver can only complete or cancel a ride",
        });
    }
}

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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
        message: "Invalid ride ID",
    });
}
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

// Check driver availability
if (!user.isAvailable) {
    return res.status(403).json({
        message: "Driver is not available",
    });
}

        const ride = await Ride.findOneAndUpdate(
    {
        _id: req.params.id,
        status: "requested",
        driver: null,
    },
    {
        driver: user._id,
        status: "accepted",
    },
    {
        new: true,
    }
);

if (!ride) {
    return res.status(400).json({
        message: "Ride is no longer available for acceptance",
    });
}
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

// Get Driver's Rides
const getMyDriverRides = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.role !== "driver") {
            return res.status(403).json({
                message: "Only drivers can view their rides",
            });
        }

        const rides = await Ride.find({
            driver: req.user.id,
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

// Update Driver Availability
const updateDriverAvailability = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.role !== "driver") {
            return res.status(403).json({
                message: "Only drivers can change availability",
            });
        }
        

        const { isAvailable } = req.body;

        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                message: "isAvailable must be true or false",
            });
        }

        user.isAvailable = isAvailable;

        await user.save();

        res.json({
            success: true,
            message: "Driver availability updated",
            isAvailable: user.isAvailable,
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
        getMyDriverRides,
        updateDriverAvailability,
};