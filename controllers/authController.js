import db from "../models/index.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, Sequelize } from "sequelize";

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const subdomain = req.headers["x-tenant"];
    const { email, password } = req.body;
    let user;
    let userPassword;
    if (subdomain == "admin") {
      user = await db.Admin.findOne({
        where: { ad_email: email },
      });
      userPassword = user.dataValues.ad_password;
    } else {
      const { Employee } = req.tenant;
      user = await Employee.findOne({
        where: { emp_email: email },
      });
      userPassword = user.dataValues.emp_password;
    }
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email doesn't exist", success: 0 });
    }
    const matchPassword = await compare(password, userPassword);
    if (!matchPassword) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: 0 });
    }
    const { ad_password, emp_password, ...safeUser } = user.dataValues;
    const payload = {
      role: user.dataValues.emp_role ? user.dataValues.emp_role : 0,
      user: safeUser,
    };
    const token = jwt.sign(payload, JWT_SECRET);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
