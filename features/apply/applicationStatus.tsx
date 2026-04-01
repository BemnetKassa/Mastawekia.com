const API = process.env.NEXT_PUBLIC_API_URL;

export const updateApplicationStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return res.json();
};