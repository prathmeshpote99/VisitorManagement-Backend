// controllers/employeeController.js
import bcrypt from "bcrypt";

export async function createEmployee(req, res) {
  try {
    const { Employee } = req.tenant;
    const {
      emp_name,
      emp_email,
      emp_mobile,
      emp_countryCode,
      de_id,
      emp_address,
      emp_region,
      emp_district,
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
      emp_status,
      emp_role,
      emp_address,
      emp_region,
      emp_district,
      emp_designation,
      emp_password: hashedPassword,
      de_id,
    });

    res.status(200).json({
      message: "Employee created",
      data: employee,
      success: 1
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal error", err, success: 0 });
  }
}

export async function getAllEmployee(req, res) {
  try {
    const { Employee, Department } = req.tenant;
    const page = parseInt(req.query.page) || 1; // current page
    const limit = 10; // records per page
    const offset = (page - 1) * limit;

    // Fetch employees with pagination
    const { count, rows: employees } = await Employee.findAndCountAll({
      include: [
        {
          model: Department,
          attributes: ["de_id", "de_title"],
        },
      ],
      order: [["emp_id", "ASC"]],
      limit,
      offset,
    });

    res.status(200).json({
      message: "Employees fetched successfully",
      results: employees,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      success: 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal error", err, success: 0 });
  }
}
