import { DataTypes } from "sequelize";

const VisitorModel = (sequelize) => {
  return sequelize.define(
    "vms_visitor",
    {
      vi_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vi_name: {
        type: DataTypes.STRING,
      },
      vi_email: {
        type: DataTypes.STRING,
      },
      vi_countryCode: {
        type: DataTypes.STRING,
      },
      vi_mobile: {
        type: DataTypes.STRING,
      },
      //1:Active, 2:Inactive, 3:Blocked
      vi_status: {
        type: DataTypes.SMALLINT,
      },
      vi_otp: {
        type: DataTypes.INTEGER,
      },
      vi_nationalId: {
        type: DataTypes.STRING,
      },
      vi_visitingCard: {
        type: DataTypes.STRING,
      },
      vi_profilePic: {
        type: DataTypes.STRING,
      },
      vi_companyFrom: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "vms_visitor",
      timestamps: false,
    }
  );
};

export default VisitorModel;
