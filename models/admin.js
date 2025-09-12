import { DataTypes } from "sequelize";

const AdminModel = (sequelize) => {
  return sequelize.define(
    "md_admin",
    {
      ad_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ad_name: {
        type: DataTypes.STRING,
      },
      ad_email: {
        type: DataTypes.STRING,
      },
      ad_password: {
        type: DataTypes.STRING,
      },
      ad_countryCode: {
        type: DataTypes.STRING,
      },
      ad_mobile: {
        type: DataTypes.STRING,
      },
      //1:Active, 2:Inactive, 3:Blocked
      ad_status: {
        type: DataTypes.SMALLINT,
      },
      ad_token: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "md_admin",
      timestamps: false,
    }
  );
};

export default AdminModel;
