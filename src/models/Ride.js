const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
    {
        pickup: {
    type: String,
    required: true,
},

pickupLocation: {
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
},

destination: {
    type: String,
    required: true,
},

destinationLocation: {
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
},
distance: {
    type: Number,
    required: true,
},

        fare: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "requested",
                "accepted",
                "completed",
                "cancelled",
            ],
            default: "requested",
        },

        passenger: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Ride", rideSchema);