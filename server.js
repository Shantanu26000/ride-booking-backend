const rideRoutes = require("./src/routes/rideRoutes");
const authRoutes = require("./src/routes/authRoutes");
const connectDB = require("./src/config/db");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);

app.get("/", (req, res) => {
    res.send("Uber Backend API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});