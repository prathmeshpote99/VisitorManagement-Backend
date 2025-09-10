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

  Employee.hasMany(Visitor, { foreignKey: "emp_id" }); // An employee may have multiple visitors
  Visitor.belongsTo(Employee, { foreignKey: "emp_id" });

  Employee.hasMany(Appointment, { foreignKey: "ap_bookedBy", as: "bookedAppointments" }); // Who booked
  Employee.hasMany(Appointment, { foreignKey: "ap_bookedFor", as: "appointmentsForMe" }); // Who is booked for
  Appointment.belongsTo(Employee, { foreignKey: "ap_bookedBy", as: "bookedBy" });
  Appointment.belongsTo(Employee, { foreignKey: "ap_bookedFor", as: "bookedFor" });

  Visitor.hasMany(Appointment, { foreignKey: "vi_id" });
  Appointment.belongsTo(Visitor, { foreignKey: "vi_id" });

  // Optional: For easy reverse lookup from Department → Appointments
  Department.hasMany(Appointment, {
    foreignKey: "ap_bookedFor",
    sourceKey: "de_id",
    as: "departmentAppointments",
  });

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
