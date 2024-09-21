const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "../../public/news");
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
}).array("images", 6);

const createNews = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "Error uploading images" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const { title, description } = req.body;
    const imageUrls = req.files.map((file) => `/news/${file.filename}`);

    try {
      const newNews = await prisma.news.create({
        data: {
          title,
          description,
          images: imageUrls,
        },
      });
      res.status(201).json(newNews);
    } catch (error) {
      res.status(500).json({ error: "Error creating news" });
    }
  });
};

const getAllNews = async (req, res) => {
  try {
    const news = await prisma.news.findMany();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Error fetching news" });
  }
};

const getNewsByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    const news = await prisma.news.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive", // Case-insensitive search
        },
      },
    });

    if (news.length === 0) {
      return res
        .status(404)
        .json({ error: "News with the given title not found" });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Error fetching news by title" });
  }
};

const updateNews = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "Error uploading images" });
    }

    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const oldNews = await prisma.news.findUnique({
        where: { id: Number(id) },
      });

      if (!oldNews) {
        return res.status(404).json({ error: "News not found" });
      }

      const newsData = {
        title: title || oldNews.title,
        description: description || oldNews.description,
        images: oldNews.images,
      };

      if (req.files && req.files.length > 0) {
        oldNews.images.forEach((imgPath) => {
          const oldImagePath = path.join(__dirname, "../../public", imgPath);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        });

        newsData.images = req.files.map((file) => `/news/${file.filename}`);
      }

      const updatedNews = await prisma.news.update({
        where: { id: Number(id) },
        data: newsData,
      });

      res.json({
        message: "News updated successfully",
        updatedNews,
      });
    } catch (error) {
      res.status(500).json({ error: "Error updating news" });
    }
  });
};

const deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await prisma.news.findUnique({
      where: { id: Number(id) },
    });

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    news.images.forEach((imgPath) => {
      const oldImagePath = path.join(__dirname, "../../public", imgPath);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    });

    await prisma.news.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting news" });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsByTitle,
  updateNews,
  deleteNews,
};
