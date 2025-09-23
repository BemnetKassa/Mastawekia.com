import prisma from "../config/prisma.js";

// Create company (CLIENT only)
export const createCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const company = await prisma.company.create({
      data: {
        name,
        description,
        website,
        location,
        ownerId: req.user.id, // logged in CLIENT
      },
    });

    res.status(201).json({ message: "Company created", company });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all companies (public)
export const getCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single company
export const getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update company (only owner)
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({ where: { id: parseInt(id) } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own company" });
    }

    const updated = await prisma.company.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    res.json({ message: "Company updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete company (only owner)
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({ where: { id: parseInt(id) } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own company" });
    }

    await prisma.company.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
