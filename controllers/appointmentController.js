export async function createAppointment(req, res) {
    try {
        const { Appointment } = req.tenant;
        const body = req.body;

        const appointment = await Appointment.create(body);

        return res.status(200).json({
            message: "Appointment created successfully",
            data: appointment,
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function getAllAppointments(req, res) {
    try {
        const { Appointment, Employee, Visitor } = req.tenant;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const { status, type, bookedBy, bookedFor } = req.query;

        // Build filters dynamically
        const where = {};
        if (status) where.ap_status = status;
        if (type) where.ap_type = type;
        if (bookedBy) where.ap_bookedBy = bookedBy;
        if (bookedFor) where.ap_bookedFor = bookedFor;

        const { count, rows: appointments } = await Appointment.findAndCountAll({
            where,
            include: [
                { model: Employee, as: "bookedBy", attributes: ["emp_id", "emp_name", "emp_email"] },
                { model: Employee, as: "bookedFor", attributes: ["emp_id", "emp_name", "emp_email"] },
                { model: Visitor, attributes: ["vi_id", "vi_name", "vi_email"] },
            ],
            order: [["ap_id", "ASC"]],
            limit,
            offset,
        });

        return res.status(200).json({
            message: "Appointments fetched successfully",
            results: appointments,
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
        const { Appointment, Employee, Visitor } = req.tenant;
        const { id } = req.params;

        const appointment = await Appointment.findOne({
            where: { ap_id: id },
            include: [
                { model: Employee, as: "bookedBy", attributes: ["emp_id", "emp_name", "emp_email"] },
                { model: Employee, as: "bookedFor", attributes: ["emp_id", "emp_name", "emp_email"] },
                { model: Visitor, attributes: ["vi_id", "vi_name", "vi_email"] },
            ],
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found",
                success: 0,
            });
        }

        return res.status(200).json({
            message: "Appointment fetched successfully",
            record: appointment,
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function updateAppointment(req, res) {
    try {
        const { Appointment } = req.tenant;
        const { id } = req.params;

        const body = req.body;

        const appointment = await Appointment.findOne({ where: { ap_id: id } });
        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found",
                success: 0,
            });
        }

        await Appointment.update(body, { where: { ap_id: id } });

        const updatedAppointment = await Appointment.findOne({ where: { ap_id: id } });

        return res.status(200).json({
            message: "Appointment updated successfully",
            result: updatedAppointment,
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function deleteAppointment(req, res) {
    try {
        const { Appointment } = req.tenant;
        const { id } = req.params;

        const appointment = await Appointment.findOne({ where: { ap_id: id } });
        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found",
                success: 0,
            });
        }

        await Appointment.destroy({ where: { ap_id: id } });

        return res.status(200).json({
            message: "Appointment deleted successfully",
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}
