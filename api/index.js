import express from "express";
import morgan from "morgan";
import colors from "colors";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/authRoute.js";
import bookingRoutes from "./Routes/bookingRoute.js";
import placeRoutes from "./Routes/placeRoute.js";
import uploadRoutes from "./Routes/uploadRoute.js";
import cookieParser from "cookie-parser";
import { v4 as uuid } from "uuid"; // Import uuid
const stripe = require("stripe")('sk_test_51PoJcqRw5EgGnz4NdiLWW3jBXOEFabtIQEDSz8wlMz61iXfbU4qwpbd1ZePKZSfTTxHa9zXlFiqMVKttQWQ42OhB00ih5qxhmk'); // Import Stripe

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

const currentModulePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentModulePath);

app.use("/uploads", express.static(path.join(currentDir, "uploads")));
app.use(morgan("dev"));
app.use(cors());

app.get("/test", (req, res) => {
  res.json("test ok");
});

// Stripe Payment Route
app.post("/payment", (req, res) => {
  const { items, token } = req.body;
  console.log("PRODUCT", items);
  console.log("PRICE", items.price);
  const idempotencyKey = uuid(); // Prevents duplicate charges

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      return stripe.charges.create(
        {
          amount: items.price * 100, // Convert to cents
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchased ${items.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

// Other routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", uploadRoutes);
app.use("/api/auth", placeRoutes);
app.use("/api/auth", bookingRoutes);

app.listen(5000, () => {
  console.log("Listening server".bgCyan.white);
});
