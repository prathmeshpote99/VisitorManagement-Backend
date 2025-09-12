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
    let userStatus;
    let tokenField;
    if (subdomain == "admin") {
      user = await db.Admin.findOne({
        where: { ad_email: email },
      });
      userPassword = user.dataValues.ad_password;
      userStatus = user.dataValues.ad_status;
      tokenField = "ad_token";
    } else {
      const { Employee } = req.tenant;
      user = await Employee.findOne({
        where: { emp_email: email },
      });
      userPassword = user.dataValues.emp_password;
      userStatus = user.dataValues.emp_status;
      tokenField = "emp_token";
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: 0 });
    }

    if (userStatus == 2 || userStatus == 3) {
      return res.status(403).json({
        message: userStatus == 2 ? "Your account has been temporarily inactive, please contact company administrator" : "Your account has been blocked",
        success: 0,
      });
    }

    const matchPassword = await compare(password, userPassword);
    if (!matchPassword) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: 0 });
    }
    const { ad_password, emp_password, ...safeUser } = user.dataValues;
    const payload = {
      role: user.dataValues.emp_role ? user.dataValues.emp_role : 0,
      user: safeUser,
    };

    let token = user.dataValues[tokenField]
    if (!token) {
      token = jwt.sign(payload, JWT_SECRET);
      await user.update({ [tokenField]: token })
    }
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
