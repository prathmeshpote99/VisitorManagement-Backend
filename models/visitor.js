
import { DataTypes } from "sequelize";

const VisitorModel = (sequelize) => {
    return sequelize.define("vms_visitor",
        {
            vi_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            vi_name: {
                type: DataTypes.STRING,
            },
            vi_email: {
                type: DataTypes.STRING,
            },
            vi_password: {
                type: DataTypes.STRING,
            },
            vi_countryCode: {
                type: DataTypes.STRING,
            },
            vi_address: {
                type: DataTypes.STRING,
            },
            vi_region: {
                type: DataTypes.STRING,
            },
            vi_district: {
                type: DataTypes.STRING,
            },
            //1:Inactive, 2:Active, 3:Blocked
            vi_status: {
                type: DataTypes.SMALLINT,
            },
            vi_otp: {
                type: DataTypes.INTEGER,
            },
            vi_nationalId: {
                type: DataTypes.STRING,
            },
            vi_type: {
                type: DataTypes.SMALLINT,
            },
            vi_visitReason: {
                type: DataTypes.STRING,
            },
            vi_card: {
                type: DataTypes.STRING,
            },
            vi_company: {
                type: DataTypes.STRING,
            },
            vi_officerDepartment: {
                type: DataTypes.STRING,
            },
            vi_officerName: {
                type: DataTypes.STRING,
            },
            //1:Yes, 2:No
            vi_delivery: {
                type: DataTypes.SMALLINT,
            },
            vi_deliveryType: {
                type: DataTypes.STRING,
            },
            vi_deliveryDetails: {
                type: DataTypes.STRING,
            },
            //1:Yes, 2:No
            vi_asset: {
                type: DataTypes.SMALLINT,
            },
            vi_assetType: {
                type: DataTypes.STRING,
            },
            vi_checkIn: {
                type: DataTypes.STRING,
            },
            vi_checkOut: {
                type: DataTypes.STRING,
            },
            vi_photo: {
                type: DataTypes.STRING,
            },
            emp_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "vms_employee",
                    key: "emp_id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        },
        {
            tableName: "vms_visitor",
            timestamps: false,
        });
}

export default VisitorModel;