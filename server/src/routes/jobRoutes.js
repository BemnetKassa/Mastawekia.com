import express from "express";
import { protect, requireRole } from "../middlewares/auth.js";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyJob,
} from "../controllers/jobController.js";

const router = express.Router();

// Employers post jobs
router.post("/", protect, requireRole("EMPLOYER"), createJob);

// Public: view jobs
router.get("/", getJobs);
router.get("/:id", getJobById);

// Employers manage jobs
router.put("/:id", protect, requireRole("EMPLOYER"), updateJob);
router.delete("/:id", protect, requireRole("EMPLOYER"), deleteJob);

// Users apply to jobs
router.post("/:id/apply", protect, requireRole("USER"), applyJob);

// Example of a protected route for ADMIN
router.post("/some-protected-route", protect, requireRole("ADMIN"), (req, res) => {
  res.send("This is a protected route for ADMINs");
});

export default router;
