const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to the database", error);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
