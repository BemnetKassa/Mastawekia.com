const API = process.env.NEXT_PUBLIC_API_URL;

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/profile/`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
