import {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompanyStatus,
    deleteCompany
} from "../controllers/companyController.js";
import express from "express";

const router = express.Router();

router.post("/createCompany", createCompany);
router.get("/getAllCompanies", getAllCompanies);
router.get("/getCompanyById/:id", getCompanyById);
router.patch("/updateCompanyStatus/:id", updateCompanyStatus);
router.delete("/deleteCompany/:id", deleteCompany);

export default router;
