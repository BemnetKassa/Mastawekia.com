const API = process.env.NEXT_PUBLIC_API_URL;

export const getJob = async (id: string) => {
  if (!API) {
    throw new Error(
      "API URL is not defined. Please set NEXT_PUBLIC_API_URL in your .env file.",
    );
  }

  const res = await fetch(`${API}/jobs/${id}`);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Fetch job error:", res.status, errorText);
    throw new Error(`Failed to fetch job: ${res.status} ${errorText}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
};
