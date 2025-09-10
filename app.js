import express from "express";
import morgan from "morgan";
import cors from "cors";
import { } from "dotenv/config";
import { connectToDB } from "./config/db.js";
import "./models/index.js";
import apiRoutes from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
connectToDB();

app.get("/", (req, res) => {
  res.status(200).json({ message: "VMS app running" });
});

app.use("/api", apiRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
