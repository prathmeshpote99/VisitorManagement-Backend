import bcrypt from "bcrypt";
import { sendEmail } from '../utils/emailService.js'
import db from "../models/index.js";

export async function createEmployee(req, res) {
  try {
    const { Employee } = req.tenant;
    const {
      emp_name,
      emp_email,
      emp_mobile,
      emp_countryCode,
      de_id,
      emp_status,
      emp_role,
      emp_designation
    } = req.body;

    // default password = email before @ + last 3 digits of mobile
    const emailPrefix = emp_email.split("@")[0];
    const mobileSuffix = emp_mobile.slice(-3);
    const defaultPassword = `${emailPrefix}@${mobileSuffix}`;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const employee = await Employee.create({
      emp_name,
      emp_email,
      emp_mobile,
      emp_countryCode,
      emp_status: 1,
      emp_role,
      emp_designation,
      emp_password: hashedPassword,
      de_id,
    });

    const subdomain = req.headers["x-tenant"];
    const company = await db.Company.findOne({ where: { co_subdomain: subdomain } });

    const emailSent = await sendEmail({
      host: company.co_smtpHost,
      email: company.co_smtpEmail,
      password: company.co_smtpPassword,
      fromName: company.co_title,
      to: emp_email,
      subject: "Account creation",
      html: `
        <p>Hello ${emp_name},</p>
        <p>Your account has been created</b>.</p>
        <p>Login using email: <b>${emp_email}</b> and default password: <b>${defaultPassword}</b></p>
      `,
    });

    return res.status(200).json({
      message: "Employee created",
      emailSent,
      data: employee,
      success: 1
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
}

export async function getAllEmployee(req, res) {
  try {
    const { Employee, Department } = req.tenant;
    const page = parseInt(req.query.page) || null; // current page
    const limit = 10; // records per page
    const offset = page ? (page - 1) * limit : null;
    const role = parseInt(req.query.role) || null
    const de_id = parseInt(req.query.de_id) || null

    let where = {};
    if (role) where.role = role
    if (de_id) where.de_id = de_id

    // Fetch employees with pagination
    const { count, rows: employees } = await Employee.findAndCountAll({
      where,
      include: [
        {
          model: Department,
          attributes: ["de_id", "de_title"],
        },
      ],
      order: [["emp_id", "ASC"]],
      ...(page ? { limit, offset } : {})
    });

    return res.status(200).json({
      message: "Employees fetched successfully",
      results: employees,
      total: count,
      page: page || "all",
      totalPages: page ? Math.ceil(count / limit) : 1,
      success: 1,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
}

export async function getEmployeeById(req, res) {
  try {
    const { Employee, Department } = req.tenant;
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: { emp_id: id },
      include: [
        {
          model: Department,
          attributes: ["de_id", "de_title"],
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        success: 0,
      });
    }

    // console.log("employee", employee.dataValues.vms_department.dataValues)

    // employee.dataValues.de_title = employee.dataValues.vms_department.dataValues.de_title
    // delete employee.dataValues.vms_department.dataValues;

    return res.status(200).json({
      message: "Employee fetched successfully",
      record: employee,
      success: 1,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
}

export async function updateEmployee(req, res) {
  try {
    const { Employee } = req.tenant;
    const { id } = req.params;

    const body = req.body;

    const employee = await Employee.findOne({ where: { emp_id: id } });
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        success: 0,
      });
    }

    await Employee.update(body, { where: { emp_id: id } });

    return res.status(200).json({
      message: "Employee updated successfully",
      success: 1,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
}

export async function deleteEmployee(req, res) {
  try {
    const { Employee } = req.tenant;
    const { id } = req.params;

    const employee = await Employee.findOne({ where: { emp_id: id } });
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        success: 0,
      });
    }

    await Employee.destroy({ where: { emp_id: id } });

    return res.status(200).json({
      message: "Employee deleted successfully",
      success: 1,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error", err, success: 0 });
  }
}
