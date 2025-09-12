import express from "express";
import morgan from "morgan";
import cors from "cors";
import { } from "dotenv/config";
import { connectToDB } from "./config/db.js";
import "./models/index.js";
import apiRoutes from "./routes/index.js";
import socketIO from "socket.io";
import http from 'http'

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
connectToDB();

app.get("/", (req, res) => {
  res.status(200).json({ message: "VMS app running" });
});

app.use("/api", apiRoutes);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
