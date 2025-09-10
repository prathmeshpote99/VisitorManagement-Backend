import {
  createDepartment,
  getAllDepartments,
} from "../controllers/departmentController.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/createDepartment", tenantMiddleware, createDepartment);
router.get("/getAllDepartments", tenantMiddleware, getAllDepartments);

export default router;
