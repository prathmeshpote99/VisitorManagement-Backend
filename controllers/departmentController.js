export const createDepartment = async (req, res) => {
  try {
    const { Department } = req.tenant;
    const { de_title } = req.body;

    const department = await Department.create({
      de_title,
    });

    return res.status(200).json({
      message: "Department created successfully",
      data: department,
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err: err.message,
    });
  }
};

export const getAllDepartments = async (req, res) => {
  try {
    const { Department, Employee } = req.tenant;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows: department } = await Department.findAndCountAll({
      include: [{ model: Employee, attributes: ["emp_name", "emp_email"] }],
      order: [["de_id", "ASC"]],
      limit,
      offset,
    });

    return res.status(200).json({
      message: "Department fetched successfully",
      results: department,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const { Department, Employee } = req.tenant;
    const { id } = req.params;

    const department = await Department.findOne({
      where: { de_id: id },
      include: [{ model: Employee, attributes: ["emp_name", "emp_email"] }],
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        success: 0,
      });
    }

    return res.status(200).json({
      message: "Department fetched successfully",
      record: department,
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err: err.message,
    });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { Department } = req.tenant;
    const { id } = req.params;
    const { de_title } = req.body;
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        success: 0,
      });
    }
    await Department.update(req.body);
    return res.status(200).json({
      message: "Department updated successfully",
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { Department } = req.tenant;
    const { id } = req.params;
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        success: 0,
      });
    }
    await Department.destroy({ where: { de_id: id } });
    return res.status(200).json({
      message: "Deparment deleted successfully",
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
