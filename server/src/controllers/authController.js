import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true },
    });

    const token = signToken(user.id);
    return res.status(201).json({ user, token });
  } catch (err) {
    console.error("[authController.register]", err);
    const body = { message: err.message };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;
    return res.status(500).json(body);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user.id);
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error("[authController.login]", err);
    const body = { message: err.message };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;
    return res.status(500).json(body);
  }
};

export const me = async (req, res) => {
  try {
    // expects your auth middleware to set req.user = { id }
    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: "Not authenticated" });

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return res.json({ user });
  } catch (err) {
    console.error("[authController.me]", err);
    const body = { message: err.message };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack;
    return res.status(500).json(body);
  }
};

// Verify JWT and fetch user from DB
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch latest user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // attach DB user to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based Access Control
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
