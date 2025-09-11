import express from "express";
import adminRouter from "./adminRoute.js";
import companyRouter from "./companyRoute.js";
import employeeRouter from "./employeeRoute.js";
import appointmentRoute from "./visitorLogRoute.js";
import visitorRoute from "./visitorRoute.js";
import departmentRouter from "./departmentRoute.js";
import authRouter from "./authRoute.js";

const router = express.Router();

router.use("/admin", adminRouter);
router.use("/company", companyRouter);
router.use("/employee", employeeRouter);
router.use("/appointment", appointmentRoute);
router.use("/visitor", visitorRoute);
router.use("/department", departmentRouter);
router.use("/auth", authRouter);

export default router;
