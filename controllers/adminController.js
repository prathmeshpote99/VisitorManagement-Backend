import db from "../models/index.js";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res) => {
  try {
    const { ad_name, ad_email, ad_countryCode, ad_mobile, ad_address } =
      req.body;

    if (!ad_email || !ad_mobile) {
      return res
        .status(400)
        .json({ message: "Email and Mobile are requiresd" });
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

    const { ad_password, ...adminData } = admin.toJSON();

    return res.status(200).json({
      message: "Admin created successfully",
      admin: adminData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const admin = await db.Admin.findAll({
      attributes: { exclude: ["ad_password"] },
    });

    return res.status(200).json({
      message: "Admin fetch successfully",
      admin,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
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
      });
    }

    return res.status(200).json({
      message: "Admin fetch successfully",
      data: admin,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
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
      });
    }

    const updateAdmin = await admin.update(req.body);

    return res.status(200).json({
      message: "Admin update successfull",
      data: updateAdmin,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteAdmin = await db.Admin.destroy({
      where: { ad_id: id },
    });

    if (deleteAdmin === 0) {
      return res.status(400).json({ message: "Admin not found" });
    }

    return res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err: err.message,
    });
  }
};
