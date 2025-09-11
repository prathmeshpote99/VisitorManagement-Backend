import { login } from "../controllers/authController.js";
import express from "express";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";

const router = express.Router();

router.post("/login", tenantMiddleware, login);

export default router;
