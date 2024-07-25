require("module-alias/register");
require("@configs");

const express = require("express");
const logger = process.env.NODE_ENV === "development" ? require("morgan") : null;
// const nocache = require("nocache");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
// app.use(nocache());
app.use(cookieParser());
// app.use(cors({credentials: true, origin: process.env.NODE_ENV === 'development' ? ["http://localhost:5173", "http://localhost:5174"] : []}));
app.use(cors({credentials: true, origin: true}));
// app.use(express.json())
app.use(express.json({verify: (req,res,buf) => { req.rawBody = buf }}))
app.use(express.urlencoded({ extended: true }));

if (logger) app.use(logger("dev"));

app.use("/api/v1", require("@routes"));

if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT || 9000, () => {
    console.log(`Server listening on port ${process.env.PORT || 9000}...  http://localhost:${process.env.PORT || 9000}`.blue)
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}...`.green);
  });
}
