const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const emailRoutes = require("./routes/emailRoutes");
const premiumRoutes = require("./routes/premiumRoutes");

const app = express();

app.use(cors());

// STRIPE WEBHOOK: Must be mapped BEFORE express.json() to preserve the raw body for signature verification!
const { handleWebhook } = require("./controllers/stripeController");
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }), handleWebhook);

app.use(express.json());

// Expose static local files natively mapping clean binary downloads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const stripeRoutes = require("./routes/stripeRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/premium", premiumRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend spinning up on http://localhost:${PORT}`));
