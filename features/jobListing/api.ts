const API = process.env.NEXT_PUBLIC_API_URL;

type JobFilters = {
  search?: string;
  company?: string;
};

export const getJobs = async (filters: JobFilters = {}) => {
  if (!API) {
    throw new Error(
      "API URL is not defined. Please set NEXT_PUBLIC_API_URL in your .env file.",
    );
  }

  const token = localStorage.getItem("token");
  const query = new URLSearchParams();

  if (filters.search) {
    query.append("search", filters.search);
  }

  if (filters.company) {
    query.append("company", filters.company);
  }

  const res = await fetch(`${API}/jobs?${query.toString()}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs.");
  }

  return res.json();
};
