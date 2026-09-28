const API = process.env.NEXT_PUBLIC_API_URL;

export const createProfile = async (profileData: {
  bio: string;
  skills: string[];
  headline: string;
  location: string;
  phone: string;
  experienceYears: number;
  availability: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}) => {
  const token = localStorage.getItem("token");
  const body: Record<string, unknown> = {
    bio: profileData.bio,
    skills: profileData.skills,
    headline: profileData.headline,
    location: profileData.location,
    phone: profileData.phone,
    experienceYears: profileData.experienceYears,
    availability: profileData.availability,
  };

  if (profileData.portfolioUrl) body.portfolioUrl = profileData.portfolioUrl;
  if (profileData.linkedinUrl) body.linkedinUrl = profileData.linkedinUrl;
  if (profileData.githubUrl) body.githubUrl = profileData.githubUrl;

  const res = await fetch(`${API}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create profile error:", res.status, errorText);
    throw new Error(`Failed to create profile: ${res.status} ${errorText}`);
  }
};
