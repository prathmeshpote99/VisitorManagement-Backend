import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import db from "../models/index.js";
import masterSequelize from "../config/db.js";

export async function createCompany(req, res) {
  const {
    co_name,
    co_subdomain,
    co_email,
    co_mobile,
    co_address,
    co_hrName,
    co_countryCode,
    co_logo,
  } = req.body;

  try {
    const dbName = `${co_subdomain.toLowerCase()}_db`;

    // 1. Create DB
    await masterSequelize.query(`CREATE DATABASE "${dbName}"`);

    // 2. Save company info in master DB
    const company = await db.Company.create({
      co_name,
      co_subdomain,
      co_database: dbName,
      co_email,
      co_mobile,
      co_address,
      co_hrName,
      co_countryCode,
      co_logo,
      co_status: 2,
    });

    // 3. Connect to new tenant DB
    const tenantSequelize = new Sequelize({
      dialect: "postgres",
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: dbName,
      port: process.env.DB_PORT,
      logging: false,
    });

    // 4. Initialize tenant models with associations
    const { Department, Employee } = db.initTenantModels(tenantSequelize);

    // 5. Sync all models (create tables)
    await tenantSequelize.sync();

    // 6. Insert default department
    const hrDept = await Department.create({
      de_title: "Human Resource Management",
    });

    // 7. Generate default password
    const emailPrefix = co_email.split("@")[0];
    const mobileSuffix = co_mobile.slice(-3);
    const defaultPassword = `${emailPrefix}@${mobileSuffix}`;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // 8. Insert default HR employee
    const hrEmployee = await Employee.create({
      emp_name: co_hrName,
      emp_email: co_email,
      emp_password: hashedPassword,
      emp_mobile: co_mobile,
      emp_countryCode: co_countryCode,
      emp_status: 2, // Active
      emp_role: 1, // HR
      emp_designation: "HR Manager",
      de_id: hrDept.de_id,
    });

    console.log(`✅ Tenant DB created & seeded for ${co_name}`);

    res.json({
      message: "Company created successfully",
      company,
      defaultDepartment: hrDept,
      defaultEmployee: {
        emp_id: hrEmployee.emp_id,
        emp_name: hrEmployee.emp_name,
        emp_email: hrEmployee.emp_email,
        emp_role: hrEmployee.emp_role,
        emp_designation: hrEmployee.emp_designation,
        defaultPassword, // send plain password once (not stored)
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
