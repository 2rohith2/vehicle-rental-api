import BookingRoute from "./routes/booking";
import BranchesRoute from "./routes/branch";
import LoginRoute from "./routes/login";
import VehiclesRoute from "./routes/vehicles";
import StatusRoute from "./routes/status";
import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import nocache from "nocache";
import { authenticateToken } from "./middleware/auth";

const app = express();

/**
 * CORS Setting to enable API can be used by any source.
 */
app.use(function (req: any, res: any, next: () => void) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(nocache());
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Authenticate middleware setup to protect resources
 */
app.use("/v1/vehicles", authenticateToken);
app.use("/v1/branches", authenticateToken);
app.use("/v1/booking", authenticateToken);
app.use("/v1/status", authenticateToken);

/**
 * Route setup
 */
app.use("/v1/login", LoginRoute);
app.use("/v1/vehicles", VehiclesRoute);
app.use("/v1/branches", BranchesRoute);
app.use("/v1/booking", BookingRoute);
app.use("/v1/status", StatusRoute);

/**
 * This is used to catch uncatched error
 */
app.get("*", function (req, res) {
  res.status(404).json({ code: 404, message: "Not found API" });
});

export default app;