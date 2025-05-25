import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import { initDB } from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(rateLimiter)


app.get("/health", (req, res) => {
    res.send("Welcome to the Expense Tracker API");
})

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
})
})