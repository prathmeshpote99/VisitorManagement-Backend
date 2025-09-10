// routes/employeeRoutes.js
import express from "express";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import {
    createEmployee,
    getAllEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/createEmployee", tenantMiddleware, createEmployee);
router.get("/getAllEmployee", tenantMiddleware, getAllEmployee);
router.get("/getEmployeeById/:id", tenantMiddleware, getEmployeeById);
router.patch("/updateEmployee/:id", tenantMiddleware, updateEmployee);
router.delete("/deleteEmployee/:id", tenantMiddleware, deleteEmployee);

export default router;
