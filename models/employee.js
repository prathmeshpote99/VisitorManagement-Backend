import { DataTypes } from "sequelize";

const EmployeeModel = (sequelize) => {
  return sequelize.define(
    "vms_employee",
    {
      emp_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      de_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "vms_department",
          key: "de_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      emp_name: {
        type: DataTypes.STRING,
      },
      emp_email: {
        type: DataTypes.STRING,
      },
      emp_password: {
        type: DataTypes.STRING,
      },
      emp_countryCode: {
        type: DataTypes.STRING,
      },
      emp_mobile: {
        type: DataTypes.STRING,
      },
      //1:Inactive, 2:Active, 3:Blocked
      emp_status: {
        type: DataTypes.SMALLINT,
      },
      //1: HR, 2: Depratment Head, 3: Officer, 4:Executive
      emp_role: {
        type: DataTypes.SMALLINT,
      },
      emp_designation: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "vms_employee",
      timestamps: false,
    }
  );
};

export default EmployeeModel;
