import {
  createAdmin,
  getAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";
import express from "express";

const router = express();

router.post("/createAdmin", createAdmin);
router.get("/getAdmin", getAdmin);
router.get("/getAdminById/:id", getAdminById);
router.patch("/updateAdmin/:id", updateAdmin);
router.delete("/deleteAdmin/:id", deleteAdmin);

export default router;
