const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const { connectDB } = require("./db/db.js");
const handleError = require("./shared/errors/handle");

// const NewsRouter = require("./routers/news.router.js");
const AdminRouter = require("./routers/admin.router.js");
dotenv.config();
const app = express();
app.use(cors());

// app use

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.get("/videos/:filename", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "public/videos", req.params.filename)
  );
});

// routes
// app.use(NewsRouter);
app.use(AdminRouter);
connectDB();

// error handle
app.use(handleError);
// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishladi :)`);
});
