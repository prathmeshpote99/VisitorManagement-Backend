import sequelize from "../config/db.js";
import AdminModel from "./admin.js";
import CompanyModel from "./company.js";
import DepartmentModel from "./department.js";
import EmployeeModel from "./employee.js";
import VisitorModel from "./visitor.js";
import VisitorLogModel from "./visitorLog.js";

const db = {};

// Master DB models
db.Admin = AdminModel(sequelize);
db.Company = CompanyModel(sequelize);

// Tenant DB initializer (for dynamic connections)
db.initTenantModels = (tenantSequelize) => {
  const Department = DepartmentModel(tenantSequelize);
  const Employee = EmployeeModel(tenantSequelize);
  const Visitor = VisitorModel(tenantSequelize);
  const VisitorLog = VisitorLogModel(tenantSequelize);

  // 🔑 Associations
  // Department ↔ Employee
  Department.hasMany(Employee, { foreignKey: "de_id" });
  Employee.belongsTo(Department, { foreignKey: "de_id" });

  // Department self-association (for hierarchy: department ↔ designation)
  Department.hasMany(Department, {
    foreignKey: "de_parentId",
    as: "subDepartments",   // children
  });
  Department.belongsTo(Department, {
    foreignKey: "de_parentId",
    as: "parentDepartment", // parent
  });


  // Employee ↔ VisitorLog
  Employee.hasMany(VisitorLog, { foreignKey: "vl_bookedBy", as: "bookedLogs" }); // Executive
  VisitorLog.belongsTo(Employee, { foreignKey: "vl_bookedBy", as: "bookedBy" });

  Employee.hasMany(VisitorLog, { foreignKey: "emp_id", as: "officerLogs" }); // Officer
  VisitorLog.belongsTo(Employee, { foreignKey: "emp_id", as: "officer" });

  // Visitor ↔ VisitorLog
  Visitor.hasMany(VisitorLog, { foreignKey: "vi_id" });
  VisitorLog.belongsTo(Visitor, { foreignKey: "vi_id" });

  // Department ↔ VisitorLog
  Department.hasMany(VisitorLog, { foreignKey: "de_id", as: "departmentLogs" });
  VisitorLog.belongsTo(Department, { foreignKey: "de_id", as: "department" });

  return {
    Department,
    Employee,
    Visitor,
    VisitorLog,
    sequelize: tenantSequelize,
  };
};

db.sequelize = sequelize;

export default db;
