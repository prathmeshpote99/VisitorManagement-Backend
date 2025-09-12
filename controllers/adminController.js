import db from "../models/index.js";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res) => {
  try {
    const { ad_name, ad_email, ad_countryCode, ad_mobile } = req.body;

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
    });

    return res.status(200).json({
      message: "Admin created successfully",
      data: admin,
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // current page
    const limit = 10; // records per page
    const offset = (page - 1) * limit;

    const { count, rows: admin } = await db.Admin.findAndCountAll({
      attributes: { exclude: ["ad_password"] },
      order: [["ad_id", "DESC"]],
      limit,
      offset,
    });

    return res.status(200).json({
      message: "Admin fetched successfully",
      results: admin,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await db.Admin.findByPk(id, {
      attributes: { exclude: "ad_password" },
    });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
        success: 0,
      });
    }

    return res.status(200).json({
      message: "Admin fetch successfully",
      record: admin,
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await db.Admin.findOne({
      where: { ad_id: id },
    });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
        success: 0,
      });
    }

    await admin.update(req.body);

    return res.status(200).json({
      message: "Admin update successfull",
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteAdmin = await db.Admin.destroy({
      where: { ad_id: id },
    });

    if (deleteAdmin === 0) {
      return res.status(400).json({ message: "Admin not found", success: 0 });
    }

    return res.status(200).json({
      message: "Admin deleted successfully",
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
};
