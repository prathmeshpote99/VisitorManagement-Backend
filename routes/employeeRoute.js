// routes/employeeRoutes.js
import express from "express";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { createEmployee, getAllEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.post("/createEmployee", tenantMiddleware, createEmployee);
router.get("/getAllEmployee", tenantMiddleware, getAllEmployee);

export default router;
