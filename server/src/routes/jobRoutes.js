import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
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
router.post("/", protect, authorize("EMPLOYER"), createJob);

// Public: view jobs
router.get("/", getJobs);
router.get("/:id", getJobById);

// Employers manage jobs
router.put("/:id", protect, authorize("EMPLOYER"), updateJob);
router.delete("/:id", protect, authorize("EMPLOYER"), deleteJob);

// Users apply to jobs
router.post("/:id/apply", protect, authorize("USER"), applyJob);

export default router;
