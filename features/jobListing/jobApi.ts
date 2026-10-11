const API = process.env.NEXT_PUBLIC_API_URL;

export const getJob = async (id: string) => {
  if (!API) {
    throw new Error(
      "API URL is not defined. Please set NEXT_PUBLIC_API_URL in your .env file.",
    );
  }

  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/jobs/${id}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Fetch job error:", res.status, errorText);
    throw new Error(`Failed to fetch job: ${res.status} ${errorText}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

export const updateJobPublication = async (id: string, isPublished: boolean) => {
  if (!API) {
    throw new Error(
      "API URL is not defined. Please set NEXT_PUBLIC_API_URL in your .env file.",
    );
  }

  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/jobs/${id}/publish`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ isPublished }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    if (res.status === 404) {
      throw new Error(
        "Job publication API is not available yet. Add PATCH /jobs/:jobId/publish to the backend.",
      );
    }
    throw new Error(`Failed to update job publication: ${res.status} ${errorText}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

export const getJobApplications = async (jobId: string) => {
  if (!API) {
    throw new Error(
      "API URL is not defined. Please set NEXT_PUBLIC_API_URL in your .env file.",
    );
  }

  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/jobs/${jobId}/applications`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch job applications: ${res.status} ${errorText}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : [];
};
