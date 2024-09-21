const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const prisma = new PrismaClient();

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

const createTeacher = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Faylni yuklashda xatolik yuz berdi" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Fayl yuklanmadi" });
    }

    const { name, experience } = req.body;

    if (!name || !experience) {
      return res.status(400).json({ error: "Name va experience kerak" });
    }

    const images = `/images/${req.file.filename}`;

    try {
      const newTeacher = await prisma.teacher.create({
        data: {
          name,
          experience,
          images,
        },
      });
      res.status(201).json(newTeacher);
    } catch (error) {
      res.status(500).json({
        error: "Yangi o'qituvchi yaratishda xatolik yuz berdi",
        details: error.message,
      });
    }
  });
};

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching teachers" });
  }
};

const updateTeacher = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "Error uploading images" });
    }

    const { id } = req.params;
    const { name, experience } = req.body;

    try {
      const oldTeacher = await prisma.teacher.findUnique({
        where: { id: Number(id) },
      });

      if (!oldTeacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      const teacherData = {
        name: name || oldTeacher.name,
        experience: experience || oldTeacher.experience,
        images: oldTeacher.images,
      };
      if (req.file) {
        const newImageUrl = `/images/${req.file.filename}`;
        const oldImagePath = path.join(
          __dirname,
          "../../public/images",
          path.basename(oldTeacher.images)
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        teacherData.images = newImageUrl;
      }

      const updatedTeacher = await prisma.teacher.update({
        where: { id: Number(id) },
        data: teacherData,
      });

      res.json({ message: "Teacher updated successfully", updatedTeacher });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error updating teacher", details: error.message });
    }
  });
};

const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: Number(id) },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    if (teacher.images && teacher.images !== "/images/default_teacher.jpg") {
      const imagePath = path.join(__dirname, "../../public", teacher.images);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.teacher.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting teacher" });
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  upload,
};
