export async function createAppointment(req, res) {
    try {
        const { VisitorLog } = req.tenant;
        const body = req.body;

        const log = await VisitorLog.create(body);

        return res.status(200).json({
            message: "VisitorLog created successfully",
            data: log,
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function getAllAppointments(req, res) {
    try {
        const { VisitorLog, Employee, Visitor, Department } = req.tenant;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const { status, type, bookedBy, officer } = req.query;

        // Build filters dynamically
        const where = {};
        if (status) where.vl_status = status;
        if (type) where.vl_type = type;
        if (bookedBy) where.vl_bookedBy = bookedBy;
        if (officer) where.emp_id = officer;

        const { count, rows: logs } = await VisitorLog.findAndCountAll({
            where,
            include: [
                { model: Employee, as: "bookedBy", attributes: ["emp_id", "emp_name", "emp_email"] },
                { model: Employee, as: "officer", attributes: ["emp_id", "emp_name", "emp_email"] },
                { model: Visitor, attributes: ["vi_id", "vi_name", "vi_email"] },
                { model: Department, as: "department", attributes: ["de_id", "de_title"] },
            ],
            order: [["vl_id", "ASC"]],
            limit,
            offset,
        });

        return res.status(200).json({
            message: "VisitorLogs fetched successfully",
            results: logs,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function getAppointmentById(req, res) {
    try {
        const { VisitorLog, Employee, Visitor, Department } = req.tenant;
        const { id } = req.params;

        const log = await VisitorLog.findOne({
            where: { vl_id: id },
            include: [
                { model: Employee, as: "bookedBy", attributes: ["emp_id", "emp_name", "emp_email"] },
                { model: Employee, as: "officer", attributes: ["emp_id", "emp_name", "emp_email"] },
                { model: Visitor, attributes: ["vi_id", "vi_name", "vi_email"] },
                { model: Department, as: "department", attributes: ["de_id", "de_title"] },
            ],
        });

        if (!log) {
            return res.status(404).json({
                message: "VisitorLog not found",
                success: 0,
            });
        }

        return res.status(200).json({
            message: "VisitorLog fetched successfully",
            record: log,
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function updateAppointment(req, res) {
    try {
        const { VisitorLog } = req.tenant;
        const { id } = req.params;

        const body = req.body;

        const log = await VisitorLog.findOne({ where: { vl_id: id } });
        if (!log) {
            return res.status(404).json({
                message: "VisitorLog not found",
                success: 0,
            });
        }

        await VisitorLog.update(body, { where: { vl_id: id } });

        const updatedLog = await VisitorLog.findOne({ where: { vl_id: id } });

        return res.status(200).json({
            message: "VisitorLog updated successfully",
            result: updatedLog,
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function deleteAppointment(req, res) {
    try {
        const { VisitorLog } = req.tenant;
        const { id } = req.params;

        const log = await VisitorLog.findOne({ where: { vl_id: id } });
        if (!log) {
            return res.status(404).json({
                message: "VisitorLog not found",
                success: 0,
            });
        }

        await VisitorLog.destroy({ where: { vl_id: id } });

        return res.status(200).json({
            message: "VisitorLog deleted successfully",
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}
