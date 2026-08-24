require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");


const pool = require("./database/db");

// Import middleware
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const purchaseReturnRoutes = require("./routes/purchaseReturnRoutes");
const saleRoutes = require("./routes/saleRoutes");
const saleReturnRoutes = require("./routes/saleReturnRoutes");
const inventoryAdjustmentRoutes = require("./routes/inventoryAdjustmentRoutes");
const stockRequestRoutes = require("./routes/stockRequestRoutes");

const getAllInventory = require("./routes/inventoryQueryRoutes");

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
        message: "Too many request. Please try again later"
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

        console.log("Database connected");

        connection.release();
    }catch(error){
        console.error("Failed to connect to the database");
        console.error(error.message);
        process.exit(1);
    }
})();

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/purchases", purchaseReturnRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/sale-returns", saleReturnRoutes);
app.use("/api/inventory-adjustments", inventoryAdjustmentRoutes);


app.use("/api/inventory", getAllInventory);
app.use("/api/stock-requests", stockRequestRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware)

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

