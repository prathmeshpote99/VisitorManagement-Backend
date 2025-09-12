import { DataTypes } from "sequelize";

const CompanyModel = (sequelize) => {
  return sequelize.define(
    "md_company",
    {
      co_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      co_title: {
        type: DataTypes.STRING,
      },
      co_subdomain: {
        type: DataTypes.STRING,
        unique: true,
      },
      co_database: {
        type: DataTypes.STRING,
      },
      co_logo: {
        type: DataTypes.STRING,
      },
      co_countryCode: {
        type: DataTypes.STRING,
      },
      co_mobile: {
        type: DataTypes.STRING,
      },
      co_address: {
        type: DataTypes.STRING,
      },
      //1:Active, 2:Inactive, 3:Blocked
      co_status: {
        type: DataTypes.SMALLINT,
      },
      co_smtpHost: {
        type: DataTypes.STRING,
      },
      co_smtpPassword: {
        type: DataTypes.STRING,
      },
      co_smtpEmail: {
        type: DataTypes.STRING,
      },
      co_hrName: {
        type: DataTypes.STRING,
      },
      co_hrEmail: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "md_company",
      timestamps: false,
    }
  );
};

export default CompanyModel;
