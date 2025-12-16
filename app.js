require("dotenv").config();
require("express-async-errors");

// security packages
const helmet = require("helmet");
const cors = require("cors");
const { xss } = require("express-xss-sanitizer");
const rateLimiter = require("express-rate-limit");

// swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const swaggerDocument = YAML.load("./swagger.yaml");

const express = require("express");
const app = express();

// connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// security middlewares
app.set("trust proxy", 1 /* number of proxies between user and server */);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  })
);
app.use(express.static("./public"));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get("/api-docs/favicon-*.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "favicon.png"));
});
const options = {
  // customFavicon: "/favicon.png",
  customSiteTitle: "Jobs API Swagger documentation",
  customCssUrl: "/swagger.css",
};
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument, options));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// error handling middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
