const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../public/images");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const trimmedFileName = file.originalname.replace(/\s+/g, "").toLowerCase();
    cb(null, Date.now() + "_" + trimmedFileName);
  },
});

const upload = multer({ storage: storage }).single("images");

const createAbout = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "Error uploading the file" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }
    const images = `/images/${req.file.filename}`;

    try {
      const newAbout = await prisma.about.create({
        data: { images },
      });
      res.status(201).json(newAbout);
    } catch (error) {
      res.status(500).json({ error: "Error creating the About page" });
    }
  });
};

const getAllAbouts = async (req, res) => {
  try {
    const abouts = await prisma.about.findMany();
    res.json(abouts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching the About pages" });
  }
};

const getAboutById = async (req, res) => {
  const { id } = req.params;
  try {
    const about = await prisma.about.findUnique({
      where: { id: Number(id) },
    });
    if (!about) {
      return res.status(404).json({ error: "About page not found" });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ error: "Error fetching the About page" });
  }
};

const updateAbout = async (req, res) => {
  const { id } = req.params;
  try {
    const oldAbout = await prisma.about.findUnique({
      where: { id: Number(id) },
    });

    if (!oldAbout) {
      return res.status(404).json({ error: "About page not found" });
    }

    const aboutData = {
      images: oldAbout.images,
    };

    if (req.file) {
      const images = `/images/${req.file.filename}`;
      if (oldAbout.images) {
        const oldImagePath = path.join(
          __dirname,
          "../../public/images",
          path.basename(oldAbout.images)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      aboutData.images = images;
    }

    const updatedAbout = await prisma.about.update({
      where: { id: Number(id) },
      data: aboutData,
    });

    res.json({
      message: "About page updated successfully",
      updatedAbout,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating the About page" });
  }
};

const deleteAbout = async (req, res) => {
  const { id } = req.params;

  try {
    const about = await prisma.about.findUnique({
      where: { id: Number(id) },
    });

    if (!about) {
      return res.status(404).json({ error: "About page not found" });
    }

    const imagePath = path.join(
      __dirname,
      "../../public/images",
      path.basename(about.images)
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await prisma.about.delete({ where: { id: Number(id) } });

    res.json({
      message: "About page deleted successfully",
      deletedAbout: about,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting the About page" });
  }
};

module.exports = {
  createAbout,
  getAllAbouts,
  getAboutById,
  updateAbout,
  deleteAbout,
  upload,
};
