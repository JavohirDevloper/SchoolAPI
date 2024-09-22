const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../public/gallery");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const trimmedFileName = file.originalname.replace(/\s+/g, "").toLowerCase();
    cb(null, Date.now() + "_" + trimmedFileName);
  },
});

const upload = multer({ storage: storage }).single("images");

const createGallery = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "Error uploading the file" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }
    const images = `gallery/${req.file.filename}`;

    try {
      const newGallery = await prisma.gallery.create({
        data: { images },
      });
      res.status(201).json(newGallery);
    } catch (error) {
      res.status(500).json({ error: "Error creating the Gallery page" });
    }
  });
};

const getAllGallery = async (req, res) => {
  try {
    const gallerys = await prisma.gallery.findMany();
    res.json(gallerys);
  } catch (error) {
    res.status(500).json({ error: "Error fetching the Gallery pages" });
  }
};

const getGalleryById = async (req, res) => {
  const { id } = req.params;
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id: Number(id) },
    });
    if (!gallery) {
      return res.status(404).json({ error: "Gallery page not found" });
    }
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: "Error fetching the Gallery page" });
  }
};

const updateGallery = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "Error uploading file" });
    }

    const { id } = req.params;

    try {
      const oldGallery = await prisma.gallery.findUnique({
        where: { id: Number(id) },
      });

      if (!oldGallery) {
        return res.status(404).json({ error: "Gallery not found" });
      }

      const galleryData = {
        images: oldGallery.images,
      };
      if (req.file) {
        const newImageUrl = `/gallery/${req.file.filename}`;
        const oldImagePath = path.join(
          __dirname,
          "../../public/gallery",
          path.basename(oldGallery.images)
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        galleryData.images = newImageUrl;
      }
      const updatedGallery = await prisma.gallery.update({
        where: { id: Number(id) },
        data: galleryData,
      });

      res.json({
        message: "Gallery updated successfully",
        updatedGallery,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error updating the gallery",
        details: error.message,
      });
    }
  });
};

const deleteGallery = async (req, res) => {
  const { id } = req.params;

  try {
    const about = await prisma.gallery.findUnique({
      where: { id: Number(id) },
    });

    if (!about) {
      return res.status(404).json({ error: "Gallery page not found" });
    }

    const imagePath = path.join(
      __dirname,
      "../../public/gallery",
      path.basename(about.images)
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await prisma.gallery.delete({ where: { id: Number(id) } });

    res.json({
      message: "Gallery page deleted successfully",
      deletedAbout: about,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting the Gallery page" });
  }
};

module.exports = {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
  upload,
};
