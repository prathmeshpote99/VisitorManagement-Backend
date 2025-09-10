import db from "../models/index.js";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res) => {
  try {
    const {
      ad_name,
      ad_email,
      ad_countryCode,
      ad_mobile,
      ad_address
    } = req.body;

    if (!ad_email || !ad_mobile) {
      return res
        .status(400)
        .json({ message: "Email and Mobile are required", success: 0 });
    }

    // Generate default password
    const emailPrefix = ad_email.split("@")[0];
    const mobileSuffix = ad_mobile.slice(-3);
    const defaultPassword = `${emailPrefix}@${mobileSuffix}`;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const admin = await db.Admin.create({
      ad_name,
      ad_email,
      ad_password: hashedPassword,
      ad_countryCode,
      ad_mobile,
      ad_address,
    });

    return res.status(200).json({
      message: "Admin created successfully",
      data: admin,
      success: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const admin = await db.Admin.findAll({
      attributes: { exclude: ["ad_password"] },
    });

    return res.status(200).json({
      message: "Admin fetch successfully",
      results: admin,
      success: 1
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
};
