import express from "express";
import adminRouter from "./adminRoute.js";
import companyRouter from "./companyRoute.js";
import employeeRouter from "./employeeRoute.js";
import departmentRouter from "./departmentRoute.js"

const router = express.Router();

router.use("/admin", adminRouter);
router.use("/company", companyRouter);
router.use("/employee", employeeRouter);
router.use("/department", departmentRouter);

export default router;
