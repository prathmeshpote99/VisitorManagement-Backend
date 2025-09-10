
import { DataTypes } from "sequelize";

const AppointmentModel = (sequelize) => {
    return sequelize.define("vms_appointment",
        {
            ap_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            //Officer
            ap_bookedFor: {
                type: DataTypes.INTEGER,
                references: {
                    model: "vms_employee",
                    key: "emp_id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            //Executive
            ap_bookedBy: {
                type: DataTypes.INTEGER,
                references: {
                    model: "vms_employee",
                    key: "emp_id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            ap_date: {
                type: DataTypes.DATE,
            },
            ap_time: {
                type: DataTypes.STRING,
            },
            //1:Booked, 2:Finished, 3:Cancelled
            ap_status: {
                type: DataTypes.SMALLINT,
            },
            //1:Delivery, 2:Other
            ap_type: {
                type: DataTypes.SMALLINT,
            },
            ap_remark: {
                type: DataTypes.STRING,
            },
            vi_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "vms_visitor",
                    key: "vi_id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        },
        {
            tableName: "vms_appointment",
            timestamps: false,
        });
}

export default AppointmentModel;