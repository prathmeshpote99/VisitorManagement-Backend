import sequelize from "../config/db.js";
import AdminModel from "./admin.js";
import CompanyModel from "./company.js";
import DepartmentModel from "./department.js";
import EmployeeModel from "./employee.js";
import VisitorModel from "./visitor.js";
import AppointmentModel from "./appointment.js";

const db = {};

// Master DB models
db.Admin = AdminModel(sequelize);
db.Company = CompanyModel(sequelize);

// Tenant DB initializer (for dynamic connections)
db.initTenantModels = (tenantSequelize) => {
  const Department = DepartmentModel(tenantSequelize);
  const Employee = EmployeeModel(tenantSequelize);
  const Visitor = VisitorModel(tenantSequelize);
  const Appointment = AppointmentModel(tenantSequelize);

  // 🔑 Associations
  Department.hasMany(Employee, { foreignKey: "de_id" });
  Employee.belongsTo(Department, { foreignKey: "de_id" });

  // Future relations (optional, uncomment when needed)
  // Employee.hasMany(Visitor, { foreignKey: "emp_id" });
  // Visitor.belongsTo(Employee, { foreignKey: "emp_id" });

  // Employee.hasMany(Appointment, { foreignKey: "emp_id" });
  // Appointment.belongsTo(Employee, { foreignKey: "emp_id" });

  return {
    Department,
    Employee,
    Visitor,
    Appointment,
    sequelize: tenantSequelize,
  };
};

db.sequelize = sequelize;

export default db;
