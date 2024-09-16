const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const superAdmin = await prisma.admin.findUnique({
      where: { email },
    });
    if (!superAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const passwordMatch = await bcrypt.compare(password, superAdmin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: superAdmin.id, role: superAdmin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json(error);
  }
};

const createAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAdmin = async (req, res) => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { email: true },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ user: admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, filter } = req.query;

    let query = {
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    };

    if (sort) {
      const sortFields = sort.split(",");
      query.orderBy = sortFields.map((field) => ({ [field]: "asc" }));
    }

    if (filter) {
      const filterFields = filter.split(",");
      filterFields.forEach((field) => {
        const [key, value] = field.split(":");
        query.where[key] = value;
      });
    }

    const totalCount = await prisma.admin.count({
      where: { isDeleted: false },
    });
    const totalPages = Math.ceil(totalCount / limit);

    const admins = await prisma.admin.findMany(query);

    const response = {
      data: admins,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      totalCount,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(id) },
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin" });
  }
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().min(4),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: { email, password },
    });

    if (!updatedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ error: "Failed to update admin" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });
    if (!deletedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res
      .status(200)
      .json({ message: "Admin deleted successfully", deletedAdmin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginAdmin,
  createAdmin,
  getAllAdmins,
  getAdminById,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
