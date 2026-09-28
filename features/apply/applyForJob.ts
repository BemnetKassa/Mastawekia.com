const API = process.env.NEXT_PUBLIC_API_URL;

export type ApplicationPayload = {
  jobId: string;
  coverLetter: string;
  resume: File;
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

  const formData = new FormData();
  formData.append("jobId", payload.jobId);
  formData.append("coverLetter", payload.coverLetter);
  formData.append("resume", payload.resume);

  if (payload.portfolioUrl) {
    formData.append("portfolioUrl", payload.portfolioUrl);
  }

  const res = await fetch(`${API}/applications`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Application request failed.");
  }

  return data;
};
