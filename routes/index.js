import express from "express";
import companyRouter from './companyRoute.js'

const router = express.Router();

router.use('/company', companyRouter)

export default router;
