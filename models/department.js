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
      //1: department, 2: designation
      de_type: {
        type: DataTypes.INTEGER,
      },
      de_parentId: {
        type: DataTypes.INTEGER,
        references: {
          model: "vms_department",
          key: "de_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "vms_department",
      timestamps: false,
    }
  );
};

export default DepartmentModel;
