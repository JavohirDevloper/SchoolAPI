const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createStatistika = async (req, res) => {
  const { number, name } = req.body;

  try {
    const newStatistika = await prisma.statistics.create({
      data: {
        number: Number(number),
        name,
      },
    });
    res.status(201).json(newStatistika);
  } catch (error) {
    res.status(500).json({ error: "Error creating statistika" });
  }
};

const getAllStatistika = async (req, res) => {
  try {
    const statistikalar = await prisma.statistics.findMany();
    res.json(statistikalar);
  } catch (error) {
    res.status(500).json({ error: "Error fetching statistika" });
  }
};

const updateStatistika = async (req, res) => {
  const { id } = req.params;
  const { number, name } = req.body;

  try {
    const updatedStatistika = await prisma.statistics.update({
      where: { id: Number(id) },
      data: {
        number: Number(number),
        name,
      },
    });

    res.json({ message: "Statistika updated successfully", updatedStatistika });
  } catch (error) {
    res.status(500).json({ error: "Error updating statistika" });
  }
};

const deleteStatistika = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.statistics.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Statistika deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting statistika" });
  }
};

module.exports = {
  createStatistika,
  getAllStatistika,
  updateStatistika,
  deleteStatistika,
};
