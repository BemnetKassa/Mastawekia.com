const API = process.env.NEXT_PUBLIC_API_URL;

export const normalizeProfile = (response: any) => {
  const profile = response?.profile || response?.data?.profile || response?.data || response;

  if (!profile || typeof profile !== "object") {
    return null;
  }

  let skills = profile.skills;
  if (typeof skills === "string") {
    try {
      const parsedSkills = JSON.parse(skills);
      skills = Array.isArray(parsedSkills) ? parsedSkills : skills.split(",");
    } catch {
      skills = skills.split(",");
    }
  }

  return {
    ...profile,
    skills: Array.isArray(skills)
      ? skills.map((skill) => String(skill).trim()).filter(Boolean)
      : [],
    portfolioUrl: profile.portfolioUrl || profile.portfolio_url || "",
    linkedinUrl: profile.linkedinUrl || profile.linkedin_url || "",
    githubUrl: profile.githubUrl || profile.github_url || "",
    experienceYears: profile.experienceYears ?? profile.experience_years,
  };
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Profile not found");
    }
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(data?.message || "Failed to fetch profile");
  }

  return data;
};
