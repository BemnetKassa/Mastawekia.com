const API = process.env.NEXT_PUBLIC_API_URL;

export const getProfile = async (profileId: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/profile/${profileId}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res.json();
  }