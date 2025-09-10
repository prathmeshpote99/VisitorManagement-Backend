export async function createVisitor(req, res) {
    try {
        const { Visitor } = req.tenant;
        const body = req.body;

        if (!vi_name || !vi_email) {
            return res.status(400).json({ message: "Name and email are required", success: 0 });
        }

        const visitor = await Visitor.create(body);

        return res.status(200).json({
            message: "Visitor created successfully",
            data: visitor,
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function getAllVisitors(req, res) {
    try {
        const { Visitor, Appointment, Employee } = req.tenant;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const { count, rows: visitors } = await Visitor.findAndCountAll({
            include: [
                {
                    model: Employee,
                    as: "employee",
                    attributes: ["emp_id", "emp_name", "emp_email"],
                },
                {
                    model: Appointment,
                    as: "appointments",
                    include: [
                        { model: Employee, as: "bookedBy", attributes: ["emp_id", "emp_name", "emp_email"] },
                        { model: Employee, as: "bookedFor", attributes: ["emp_id", "emp_name", "emp_email"] },
                    ],
                },
            ],
            order: [["vi_id", "ASC"]],
            limit,
            offset,
        });

        return res.status(200).json({
            message: "Visitors fetched successfully",
            results: visitors,
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

export async function getVisitorById(req, res) {
    try {
        const { Visitor, Appointment, Employee } = req.tenant;
        const { id } = req.params;

        const visitor = await Visitor.findByPk(id, {
            include: [
                {
                    model: Employee,
                    as: "employee",
                    attributes: ["emp_id", "emp_name", "emp_email"],
                },
                {
                    model: Appointment,
                    as: "appointments",
                    include: [
                        { model: Employee, as: "bookedBy", attributes: ["emp_id", "emp_name", "emp_email"] },
                        { model: Employee, as: "bookedFor", attributes: ["emp_id", "emp_name", "emp_email"] },
                    ],
                },
            ],
        });

        if (!visitor) {
            return res.status(404).json({ message: "Visitor not found", success: 0 });
        }

        return res.status(200).json({
            message: "Visitor fetched successfully",
            record: visitor,
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function updateVisitor(req, res) {
    try {
        const { Visitor } = req.tenant;
        const { id } = req.params;
        const body = req.body;

        const visitor = await Visitor.findByPk(id);

        if (!visitor) {
            return res.status(404).json({ message: "Visitor not found", success: 0 });
        }

        await visitor.update(body);

        return res.status(200).json({
            message: "Visitor updated successfully",
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}

export async function deleteVisitor(req, res) {
    try {
        const { Visitor } = req.tenant;
        const { id } = req.params;

        const visitor = await Visitor.findByPk(id);

        if (!visitor) {
            return res.status(404).json({ message: "Visitor not found", success: 0 });
        }

        await visitor.destroy();

        return res.status(200).json({
            message: "Visitor deleted successfully",
            success: 1,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal error", err, success: 0 });
    }
}
