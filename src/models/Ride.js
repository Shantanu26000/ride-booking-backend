const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
    {
        pickup: {
            type: String,
            required: true,
        },

        destination: {
            type: String,
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Ride", rideSchema);