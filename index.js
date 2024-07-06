const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const router = require("./routes/routes");
const cookiesParser = require("cookie-parser");
const { app, server } = require("./socket/index");
// const app = express();
const allowedOrigins = ['https://dejj-chat-app.vercel.app', 'http://localhost:3000'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookiesParser());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({
    message: "Server running at " + PORT,
  });
});

// api endpoints
app.use("/api", router);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server running at " + PORT);
  });
});
