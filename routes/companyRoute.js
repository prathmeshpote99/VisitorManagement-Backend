import { createCompany } from "../controllers/companyController.js";
import express from "express";

const router = express.Router();

router.post("/createCompany", createCompany);

export default router;
