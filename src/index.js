const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
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

// app use

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.get("/public/:filename", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "public/images", req.params.filename)
  );
});

// routes
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

// error handle
app.use(handleError);
// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishladi :)`);
});
