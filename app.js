const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const rTracer = require("cls-rtracer");
const helmet = require("helmet");
const logger = require("./utils/logger");

const app = express();

app.use(rTracer.expressMiddleware());
app.use((req, res, next) => {
   logger.info(`${req.method} ${req.url}`);
   const startHrTime = process.hrtime();
   res.on("finish", () => {
      const elapsedHrTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
      logger.info(`elapsed request time: ${elapsedTimeInMs}ms`);
   });
   next();
});

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require("./middlewares/extractUser"));

app.use(require("./routes"));

module.exports = app;
