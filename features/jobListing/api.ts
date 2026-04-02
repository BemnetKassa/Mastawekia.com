const API = process.env.NEXT_PUBLIC_API_URL;

export const getJobs = async () => {
  const token = localStorage.getItem("token");
  if (!API) {
    throw new Error(
      "API URL is not defined. Please set NEXT_PUBLIC_API_URL in your .env file.",
    );
  }

  const res = await fetch(`${API}/jobs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch jobs.");
  }

  return res.json();
};
