import prisma from "../config/prisma.js";

// ✅ Create a Job (Employer only)
export const createJob = async (req, res) => {
  try {
    const { title, description, location, salary } = req.body;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salary,
        employerId: req.user.id, // employer posting
      },
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error creating job", error: err.message });
  }
};

// ✅ Get all jobs (Public)
export const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        employer: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};

// ✅ Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { employer: true },
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err.message });
  }
};

// ✅ Update job (Employer only)
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, salary } = req.body;

    const job = await prisma.job.update({
      where: { id: parseInt(id) },
      data: { title, description, location, salary },
    });

    res.json({ message: "Job updated", job });
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
};

// ✅ Delete job (Employer only)
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.job.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};

// ✅ Apply to a Job (User only)
export const applyJob = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        jobId: parseInt(id),
      },
    });

    res.status(201).json({ message: "Applied successfully", application });
  } catch (err) {
    res.status(500).json({ message: "Error applying to job", error: err.message });
  }
};
