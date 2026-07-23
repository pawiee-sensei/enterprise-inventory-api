require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

//middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Inventory Management API is running."
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});