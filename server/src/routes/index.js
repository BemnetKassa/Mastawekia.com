import express from "express";
import authRoutes from "./authRoutes.js";
import jobRoutes from "./jobRoutes.js";
import profileRoutes from "./profileRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/profile", profileRoutes);

export default router;
