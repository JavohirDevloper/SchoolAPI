const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const { connectDB } = require("./db/db.js");
const handleError = require("./shared/errors/handle");

const AdminRouter = require("./routers/admin.router.js");
const CaruselRouter = require("./routers/carusel.router.js");
const AboutRouter = require("./routers/about.router.js");
const NewsRouter = require("./routers/news.router.js");
const StatisticsRouter = require("./routers/statistics.router.js");
const TeacherRouter = require("./routers/teacher.router.js");
const GalleryRouter = require("./routers/gallarey.router.js");
const LeadershipRouter = require("./routers/leadership.router.js");
const ApplicationRouter = require("./routers/application.router.js");
const CommentRouter = require("./routers/comment.router.js");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.get("/public/:folder/:filename", (req, res) => {
  const { folder, filename } = req.params;
  const validFolders = ["images", "news", "carousel", "gallery"];

  if (!validFolders.includes(folder)) {
    return res.status(400).json({ error: "Invalid folder name" });
  }

  const filePath = path.join(__dirname, "..", "public", folder, filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }
    res.sendFile(filePath);
  });
});

// Routes
app.use(AdminRouter);
app.use(CaruselRouter);
app.use(AboutRouter);
app.use(NewsRouter);
app.use(StatisticsRouter);
app.use(GalleryRouter);
app.use(TeacherRouter);
app.use(LeadershipRouter);
app.use(ApplicationRouter);
app.use(CommentRouter);

connectDB();

// Error handling
app.use(handleError);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishladi :)`);
});
