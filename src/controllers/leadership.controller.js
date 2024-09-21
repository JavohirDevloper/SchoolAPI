const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "../../public/images");
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const trimmedFileName = file.originalname
        .replace(/\s+/g, "")
        .toLowerCase();
      cb(null, Date.now() + "_" + trimmedFileName);
    },
  }),
}).single("images");

const createLeadership = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "Error uploading images" });
    }

    const { fullname, position, phone_number, email, acceptance_days } =
      req.body;

    if (!fullname || !position || !phone_number || !email || !acceptance_days) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const images = req.file ? `/images/${req.file.filename}` : undefined;

    try {
      const newLeadership = await prisma.leadership.create({
        data: {
          fullname,
          position,
          phone_number,
          email,
          acceptance_days,
          images,
        },
      });
      res.status(201).json(newLeadership);
    } catch (error) {
      console.error("Error creating Leadership:", error);
      res.status(500).json({ error: "Error creating Leadership" });
    }
  });
};

const getAllLeadership = async (req, res) => {
  try {
    const leadership = await prisma.leadership.findMany();
    res.json(leadership);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Leadership" });
  }
};

const updateLeadership = async (req, res) => {
  const { id } = req.params;
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "Error uploading images" });
    }

    const { fullname, position, phone_number, email, acceptance_days } =
      req.body;

    try {
      const oldLeadership = await prisma.leadership.findUnique({
        where: { id: Number(id) },
      });

      if (!oldLeadership) {
        return res.status(404).json({ error: "Leadership not found" });
      }

      const leadershipData = {
        fullname: fullname || oldLeadership.fullname,
        position: position || oldLeadership.position,
        phone_number: phone_number || oldLeadership.phone_number,
        email: email || oldLeadership.email,
        acceptance_days: acceptance_days || oldLeadership.acceptance_days,
        images: oldLeadership.images,
      };

      if (req.file) {
        const newImageUrl = `/images/${req.file.filename}`;
        const oldImagePath = path.join(
          __dirname,
          "../../public/images",
          path.basename(oldLeadership.images)
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        leadershipData.images = newImageUrl;
      }

      const updatedLeadership = await prisma.leadership.update({
        where: { id: Number(id) },
        data: leadershipData,
      });

      res.json({
        message: "Leadership updated successfully",
        updatedLeadership,
      });
    } catch (error) {
      res.status(500).json({ error: "Error updating Leadership" });
    }
  });
};

const deleteLeadership = async (req, res) => {
  const { id } = req.params;

  try {
    const leadership = await prisma.leadership.findUnique({
      where: { id: Number(id) },
    });

    if (!leadership) {
      return res.status(404).json({ error: "Leadership not found" });
    }

    if (leadership.images) {
      const imagePath = path.join(
        __dirname,
        "../../public/images",
        path.basename(leadership.images)
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.leadership.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Leadership deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Leadership" });
  }
};

module.exports = {
  createLeadership,
  getAllLeadership,
  updateLeadership,
  deleteLeadership,
};
