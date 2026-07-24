require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");


const pool = require("./database/db");

const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// SECURITY MIDDLEWARE
// =========================
app.use(helmet());
app.use(cors());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

app.use(morgan("dev"));
// =========================
// BODY PARSING
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========================
// HEALTH CHECK ROUTE
// =========================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello world!"
    });
});

// =========================
// DATABASE CONNECTION TEST
// =========================
(async () => {
    try{
        const connection = await pool.getConnection();

        console.log("Databases connected");

        connection.release();
    }catch (error) {
        console.error("Failed to connect to database");
        console.error(error.message);
        process.exit(1);
    }
})();

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

