const API = process.env.NEXT_PUBLIC_API_URL;

export const getMyApplications = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/applications/me`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
