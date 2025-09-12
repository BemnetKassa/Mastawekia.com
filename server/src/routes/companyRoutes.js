import express from "express";
import {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { verifyToken, requireRole } from "../middlewares/auth.js";

const router = express.Router();

// Public
router.get("/", getCompanies);
router.get("/:id", getCompany);

// Protected (CLIENT only)
router.post("/", verifyToken, requireRole(["CLIENT"]), createCompany);
router.put("/:id", verifyToken, requireRole(["CLIENT"]), updateCompany);
router.delete("/:id", verifyToken, requireRole(["CLIENT"]), deleteCompany);

export default router;
