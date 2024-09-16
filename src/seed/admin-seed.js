const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const admins = require("./admin.json");

const prisma = new PrismaClient();

async function main() {
  for (const admin of admins) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(admin.password, salt);
    await prisma.admin.create({
      data: {
        email: admin.email,
        password: hashedPassword,
        role: admin.role,
      },
    });
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
