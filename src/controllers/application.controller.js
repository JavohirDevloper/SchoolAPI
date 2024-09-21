const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createApplication = async (req, res) => {
  const { fullname, phone_number, message } = req.body;

  if (!fullname || !phone_number || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newApplication = await prisma.application.create({
      data: {
        fullname,
        phone_number,
        message,
      },
    });
    res.status(201).json(newApplication);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating Application", details: error.message });
  }
};

const getAllApplication = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Application" });
  }
};

const deleteApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    await prisma.application.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Application" });
  }
};

module.exports = {
  createApplication,
  getAllApplication,
  deleteApplication,
};
