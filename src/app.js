const express = require("express");
const connectMongo = require("./config/mongoDb");

const vendorRoutes = require("./routes/vendorRoutes");
const adminRoutes = require("./routes/adminRoutes");

const morgan = require("morgan");
const passport = require("passport");
const cors = require("cors");
const path = require("path")

const app = express();

// connect to MongoDB
connectMongo();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

//middleware
app.use(express.static(path.join(__dirname, "../")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(passport.initialize());
require("./config/passport")(passport);
app.use(cors(corsOptions));


app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);


app.use("/", (req, res) => {
  res.send("server is running");
});

module.exports = app;
