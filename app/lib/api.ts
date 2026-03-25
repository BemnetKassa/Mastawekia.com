
const API = process.env.NEXT_PUBLIC_API_URL;

export const getJobs = async () => {
  if (!API) {
    throw new Error('API URL is not defined. Please set NEXT_PUBLIC_API_URL in your .env file.');
  }
  const res = await fetch(`${API}/jobs`);
  return res.json();
};


export const createJob = async (data: any) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};