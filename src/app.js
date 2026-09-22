import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import approachRoutes from "./routes/approachRoutes.js";
import youthRouter from "./routes/youthRoutes.js";
import adolescentRouter from "./routes/adolescentRoutes.js";
import aboutHeroRouter from "./routes/aboutHeroRoutes.js";
import reportsHeroRouter from "./routes/reportsHeroRoutes.js";
import reportSectionRouter from "./routes/reportSectionRoutes.js";
import reportItemRoutes from "./routes/reportsitemsroutes.js";
import policyItemsRoutes from "./routes/policyItemsRoutes.js";
import footerRoutes from './routes/footerRoutes.js';
import getInvolvedRoutes from './routes/getInvolvedRoutes.js';
import socialChangeRoutes from './routes/socialChangeRoutes.js';
import visionMissionRoutes from './routes/VisionMissionRouter.js'; 
import impactRoutes from './routes/impactRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import ApproachPagesRoute from "./routes/ApproachPageRoutes.js";
import contactRouter from './routes/contactformroutes.js';
import bePartnerRoutes from './routes/bepartnerroutes.js';
import beVolunteerRoutes from './routes/BeVolunteerRoutes.js';
import beInternRoutes from './routes/beInternRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import getRoutes from './routes/getRoutes.js';
import donateRoutes from './routes/donateRoutes.js';
import heroRouter from "./routes/heroroutes.js";
import storyHeroRoutes from "./routes/storyHeroRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import heroMainRoutes from './routes/heroMainRoutes.js'; // Ensure this matches your file name
import NewProgramRoutes from "./routes/NewProgramRoutes.js";
import categoryRoutes from "./routes/Newroutes.js";

import heroRoutes from "./routes/heroroutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://cydaindia.org",
        "https://www.cydaindia.org",
      ];
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// HELMET
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// COMPRESSION & BODY PARSER
app.use(compression());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// =====================================================
// UPLOADS FOLDER & STATIC ROUTE
// =====================================================
const UPLOADS_PATH = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOADS_PATH)) {
    fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}

console.log("STATIC UPLOADS PATH:", UPLOADS_PATH);

app.use(
  "/uploads",
  express.static(UPLOADS_PATH, {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

// =====================================================
// ROUTES MOUNTING
// =====================================================
app.use("/api/contact-categories", heroRoutes);
app.use('/api/stories', storyRoutes);
app.use("/api/pages/approach", approachRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/pages/youth", youthRouter);
app.use("/api/adolescent", adolescentRouter);
app.use("/api/about-hero", aboutHeroRouter);
app.use("/api/reports-hero", reportsHeroRouter);
app.use("/api/reportsection", reportSectionRouter);
app.use('/api/reportsectionitem', reportItemRoutes);
app.use('/api/policies', policyItemsRoutes); 
app.use('/api/footer', footerRoutes);
app.use('/api/get-involved', getInvolvedRoutes);
app.use('/api/socialchange', socialChangeRoutes);
app.use('/api/vision-mission', visionMissionRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/partners', partnerRoutes);
app.use("/api/pages/approachpages", ApproachPagesRoute);
app.use('/api/contact', contactRouter);
app.use('/api/partner', bePartnerRoutes);
app.use('/api/bevolunteer', beVolunteerRoutes);
app.use('/api/beintern', beInternRoutes);
app.use('/api', vendorRoutes);
app.use('/api/default-data', getRoutes);
app.use('/api/donate', donateRoutes);
app.use("/api/contact-categories", heroRouter);
app.use("/api/story-hero", storyHeroRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/team', teamRoutes);
app.use("/api/heromain", heroMainRoutes); // Ensuring correct prefix mapping
app.use("/api/newprograms", NewProgramRoutes);
app.use("/api/content", categoryRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running...",
  });
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("================================");
  console.error("SERVER ERROR");
  console.error(err);
  console.error("================================");

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =====================================================
// SERVER LISTEN
// =====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});

export default app;