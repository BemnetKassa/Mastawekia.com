const API = process.env.NEXT_PUBLIC_API_URL;

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
