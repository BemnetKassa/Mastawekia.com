const API = process.env.NEXT_PUBLIC_API_URL;

export const getJobs = async () => {
  if (!API) {
    throw new Error("API URL is not defined. Please set NEXT_PUBLIC_API_URL in your .env file.");
  }

  const res = await fetch(`${API}/jobs`);
  if (!res.ok) {
    throw new Error("Failed to fetch jobs.");
  }

  return res.json();
};

export const applyToJob = async (jobId: string) => {
  if (!API) {
    throw new Error("API URL is not defined. Please set NEXT_PUBLIC_API_URL in your .env file.");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to apply.");
  }

  const res = await fetch(`${API}/applications/${jobId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Application request failed.");
  }

  return data;
};
