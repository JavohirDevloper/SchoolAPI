const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "../../public/carousel");
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

const createCarousel = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Faylni yuklashda xatolik yuz berdi" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Fayl yuklanmadi" });
    }

    const { title } = req.body;
    const imageUrl = `/images/${req.file.filename}`;

    try {
      const newCarousel = await prisma.carousel.create({
        data: { title, imageUrl },
      });
      res.status(201).json(newCarousel);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Yangi carousel yaratishda xatolik yuz berdi" });
    }
  });
};

const getAllCarousels = async (req, res) => {
  try {
    const carousels = await prisma.carousel.findMany();
    res.json(carousels);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const getCarouselById = async (req, res) => {
  const { id } = req.params;
  try {
    const carousel = await prisma.carousel.findUnique({
      where: { id: Number(id) },
    });
    res.json(carousel);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const updateCarousel = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const oldCarousel = await prisma.carousel.findUnique({
      where: { id: Number(id) },
    });

    if (!oldCarousel) {
      return res.status(404).json({ error: "Carousel not found" });
    }

    const carouselData = {
      title: title || oldCarousel.title,
      imageUrl: oldCarousel.imageUrl,
    };

    if (req.file) {
      const imageUrl = `/carousel/${req.file.filename}`;

      if (oldCarousel.imageUrl) {
        const oldImagePath = path.join(
          __dirname,
          "../../public/carousel",
          path.basename(oldCarousel.imageUrl)
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      carouselData.imageUrl = imageUrl;
    }

    const updatedCarousel = await prisma.carousel.update({
      where: { id: Number(id) },
      data: carouselData,
    });
    res.json({
      message: "Carousel updated successfully",
      updatedCarousel,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error updating the carousel",
    });
  }
};

const deleteCarousel = async (req, res) => {
  const { id } = req.params;
  try {
    const carousel = await prisma.carousel.findUnique({
      where: { id: Number(id) },
    });

    if (!carousel) {
      return res.status(404).json({ error: "Carousel not found" });
    }

    const filePath = path.join(
      __dirname,
      "../../public/carousel/",
      carousel.imageUrl
    );

    if (carousel.imageUrl && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
    }
    await prisma.carousel.delete({ where: { id: Number(id) } });
    res
      .status(200)
      .json({ message: "Rasm o'chirildi", deletedCarousel: carousel });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Rasmni o'chirishda xatolik ro'y berdi", details: error });
  }
};

module.exports = {
  createCarousel,
  getAllCarousels,
  getCarouselById,
  updateCarousel,
  deleteCarousel,
  upload,
};
