require("dotenv").config();
const cors = require("cors");

const express = require("express");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const claimRoutes = require("./src/routes/claimRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const contactRoutes = require("./src/routes/contactRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", itemRoutes);
app.use("/api", claimRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactRoutes);

connectDB();

app.get("/", (req, res) => {
    res.send("Lost & Found Backend is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});