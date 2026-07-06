const Ride = require("../models/Ride");

// Create Ride
const createRide = async (req, res) => {
    try {
        const { pickup, destination, fare } = req.body;

      if (
    !pickup?.trim() ||
    !destination?.trim() ||
    fare == null ||
    fare <= 0
) {
    return res.status(400).json({
        message: "Invalid ride details",
    });
}

const rides = await Ride.find({
    passenger: req.user.id,
})
.populate("passenger", "name email")
.sort({
    createdAt: -1,
});

        res.status(201).json({
            success: true,
            ride,
        });

    } catch (err) {
        res.status(500).json({
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

        ride.status = req.body.status || ride.status;

        await ride.save();

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

module.exports = {
    createRide,
    getMyRides,
    getRide,
    updateRide,
    deleteRide,
};