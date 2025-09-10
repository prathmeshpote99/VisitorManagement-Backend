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
        const { Department, Employee, Visitor, Appointment } = db.initTenantModels(tenantSequelize);

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

        return res.json({
            message: "Company created successfully",
            data: {
                company,
                hrDept,
                defaultEmployee: {
                    emp_id: hrEmployee.emp_id,
                    emp_name: hrEmployee.emp_name,
                    emp_email: hrEmployee.emp_email,
                    emp_role: hrEmployee.emp_role,
                    emp_designation: hrEmployee.emp_designation,
                }
            },
            success: 1
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function getAllCompanies(req, res) {
    try {
        const page = parseInt(req.query.page) || 1; // current page
        const limit = 10; // records per page
        const offset = (page - 1) * limit;

        // Fetch companies with pagination
        const { count, rows: companies } = await db.Company.findAndCountAll({
            order: [["co_id", "ASC"]],
            limit,
            offset,
        });

        return res.status(200).json({
            message: "Companies fetched successfully",
            results: companies,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function getCompanyById(req, res) {
    try {
        const { id } = req.params;

        const company = await db.Company.findOne({
            where: { co_id: id },
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: 0,
            });
        }

        return res.status(200).json({
            message: "Company fetched successfully",
            record: company,
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function updateCompanyStatus(req, res) {
    try {
        const { id } = req.params;

        const { co_status } = req.body;

        const company = await db.Company.findOne({ where: { co_id: id } });
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: 0,
            });
        }

        await db.Company.update({ co_status }, { where: { co_id: id } });

        return res.status(200).json({
            message: "Company status updated",
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function deleteCompany(req, res) {
    try {
        const { id } = req.params;

        const company = await db.Company.findOne({ where: { co_id: id } });
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: 0,
            });
        }

        await db.Company.destroy({ where: { co_id: id } });

        return res.status(200).json({
            message: "Company deleted successfully",
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}