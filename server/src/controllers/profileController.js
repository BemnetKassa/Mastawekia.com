import prisma from "../config/prisma.js";

// ✅ Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// ✅ Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
    });

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};
