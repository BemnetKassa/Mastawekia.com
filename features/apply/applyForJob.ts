const API = process.env.NEXT_PUBLIC_API_URL;

export type ApplicationPayload = {
  jobId: string;
  coverLetter: string;
  resumeUrl: string;
  portfolioUrl?: string;
};

export const applyToJob = async (payload: ApplicationPayload) => {
  if (!API) {
    throw new Error("API URL is not defined. Please set NEXT_PUBLIC_API_URL in your .env file.");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to apply.");
  }

  const res = await fetch(`${API}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Application request failed.");
  }

  return data;
};
