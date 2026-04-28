const API = process.env.NEXT_PUBLIC_API_URL;

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/profile/`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    // Handle specific cases
    if (res.status === 404) {
      return null; // profile not created yet
    }
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch profile");
  }

  return res.json();
};
