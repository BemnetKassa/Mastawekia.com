const API = process.env.NEXT_PUBLIC_API_URL;

export const getApplications = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/applications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized. Please login again.");
  }
  if (res.status === 403) {
    throw new Error("Forbidden. You do not have access to this resource.");
  }
  if (res.status === 404) {
    throw new Error("Applications not found.");
  }
  if (res.status === 500) {
    throw new Error("Server error. Please try again later.");
  }
  return res.json();
};
