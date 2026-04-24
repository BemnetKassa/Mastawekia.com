const API = process.env.NEXT_PUBLIC_API_URL;

export const getApplications = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/applications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
