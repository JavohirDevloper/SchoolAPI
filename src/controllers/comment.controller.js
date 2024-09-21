const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createComment = async (req, res) => {
  const { newsId } = req.params;
  const { message, fullname, email, phone_number } = req.body;

  if (!message || !fullname) {
    return res.status(400).json({ error: "Message and Fullname are required" });
  }

  try {
    const newsExists = await prisma.news.findUnique({
      where: { id: Number(newsId) },
    });

    if (!newsExists) {
      return res.status(404).json({ error: "News item not found" });
    }

    // Create a new comment linked to the specific news item
    const newComment = await prisma.comment.create({
      data: {
        message,
        fullname,
        email,
        phone_number,
        newsId: Number(newsId),
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({
      error: "Error creating comment",
      details: error.message,
    });
  }
};
const getCommentsByNewsId = async (req, res) => {
  const { newsId } = req.params;

  try {
    const newsExists = await prisma.news.findUnique({
      where: { id: Number(newsId) },
    });

    if (!newsExists) {
      return res.status(404).json({ error: "News item not found" });
    }
    const comments = await prisma.comment.findMany({
      where: { newsId: Number(newsId) },
      orderBy: { createdAt: "desc" },
      include: {
        news: true,
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching comments",
      details: error.message,
    });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        news: true,
      },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching all comments" });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await prisma.comment.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};

module.exports = {
  createComment,
  getAllComments,
  getCommentsByNewsId,
  deleteComment,
};
