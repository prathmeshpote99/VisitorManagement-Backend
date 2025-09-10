// routes/employeeRoutes.js
import express from "express";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { createEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.post("/createEmployee", tenantMiddleware, createEmployee);

export default router;
