const API = process.env.NEXT_PUBLIC_API_URL;

export const createProfile = async (profileData: {
  bio: string;
  skills: string[];
}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create profile error:", res.status, errorText);
    throw new Error(`Failed to create profile: ${res.status} ${errorText}`);
  }
};
