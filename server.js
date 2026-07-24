require("dotenv").config();

const express = require("express");
const app = express();

const pool = require("./database/db");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello world!"
    });
});

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

