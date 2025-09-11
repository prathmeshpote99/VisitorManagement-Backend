import { DataTypes } from "sequelize";

const VisitorLogModel = (sequelize) => {
  return sequelize.define(
    "vms_visitorLog",
    {
      vl_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      //Officer
      emp_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "vms_employee",
          key: "emp_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      //Executive
      vl_bookedBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "vms_employee",
          key: "emp_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      vl_date: {
        type: DataTypes.DATEONLY,
      },
      vl_time: {
        type: DataTypes.STRING,
      },
      //1:Booked, 2:Finished, 3:Cancelled
      vl_status: {
        type: DataTypes.SMALLINT,
      },
      //1:Visitor, 2:Delivery
      vl_type: {
        type: DataTypes.SMALLINT,
      },
      vl_remark: {
        type: DataTypes.STRING,
      },
      vl_authCode: {
        type: DataTypes.INTEGER,
      },
      vl_visitReason: {
        type: DataTypes.STRING,
      },
      vl_deliveryType: {
        type: DataTypes.STRING,
      },
      vl_deliveryDetails: {
        type: DataTypes.STRING,
      },
      vl_checkIn: {
        type: DataTypes.DATE,
      },
      vl_checkOut: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "vms_visitorLog",
      timestamps: false,
    }
  );
};

export default VisitorLogModel;
