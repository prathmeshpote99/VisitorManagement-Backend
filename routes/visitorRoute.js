// routes/employeeRoutes.js
import express from "express";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import {
    createVisitor,
    getAllVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor
} from "../controllers/visitorController.js";

const router = express.Router();

router.post("/createVisitor", tenantMiddleware, createVisitor);
router.get("/getAllVisitors", tenantMiddleware, getAllVisitors);
router.get("/getVisitorById/:id", tenantMiddleware, getVisitorById);
router.patch("/updateVisitor/:id", tenantMiddleware, updateVisitor);
router.delete("/deleteVisitor/:id", tenantMiddleware, deleteVisitor);

export default router;
