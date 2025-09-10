import express from "express";
import adminRouter from "./adminRoute.js";
import companyRouter from "./companyRoute.js";
import employeeRouter from "./employeeRoute.js";
import appointmentRoute from "./appointmentRoute.js";
import visitorRoute from "./visitorRoute.js";

const router = express.Router();

router.use("/admin", adminRouter);
router.use("/company", companyRouter);
router.use("/employee", employeeRouter);
router.use("/appointment", appointmentRoute);
router.use("/visitor", visitorRoute);

export default router;
