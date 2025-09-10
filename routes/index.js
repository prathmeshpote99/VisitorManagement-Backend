import express from "express";
import adminRouter from "./adminRoute.js";
import companyRouter from "./companyRoute.js";
import employeeRouter from "./employeeRoute.js";

const router = express.Router();

router.use("/admin", adminRouter);
router.use("/company", companyRouter);
router.use("/employee", employeeRouter);

export default router;
