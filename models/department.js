import { DataTypes } from "sequelize";

const DepartmentModel = (sequelize) => {
  return sequelize.define(
    "vms_department",
    {
      de_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      de_title: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "vms_department",
      timestamps: false,
    }
  );
};

export default DepartmentModel;
