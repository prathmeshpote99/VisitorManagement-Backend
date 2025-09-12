import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";
import express from "express";
import { tenantMiddleware } from '../middleware/tenantMiddleware.js'

const router = express.Router();

router.post("/createAdmin", createAdmin);
router.get("/getAllAdmins", getAllAdmins);
router.get("/getAdminById/:id", getAdminById);
router.patch("/updateAdmin/:id", tenantMiddleware, updateAdmin);
router.delete("/deleteAdmin/:id", deleteAdmin);

export default router;
