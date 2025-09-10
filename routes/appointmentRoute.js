// routes/employeeRoutes.js
import express from "express";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/createAppointment", tenantMiddleware, createAppointment);
router.get("/getAllAppointments", tenantMiddleware, getAllAppointments);
router.get("/getAppointmentById/:id", tenantMiddleware, getAppointmentById);
router.patch("/updateAppointment/:id", tenantMiddleware, updateAppointment);
router.delete("/deleteAppointment/:id", tenantMiddleware, deleteAppointment);

export default router;
