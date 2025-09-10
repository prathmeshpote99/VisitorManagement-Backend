// controllers/employeeController.js
import bcrypt from "bcrypt";

export async function createEmployee(req, res) {
  try {
    const { Employee } = req.tenant;
    const { emp_name, emp_email, emp_mobile, emp_countryCode, de_id } = req.body;

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
      emp_status: 2,
      emp_role: 4,
      emp_designation: "Executive",
      emp_password: hashedPassword,
      de_id,
    });

    res.json({
      message: "Employee created",
      employee,
      defaultPassword, // ⚠️ send plain password once
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
