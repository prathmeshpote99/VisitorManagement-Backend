import { createAdmin, getAdmin } from "../controllers/adminController.js";
import express from "express";

const router = express();

router.post("/createAdmin", createAdmin);
router.get("/getAdmin", getAdmin);

export default router;
