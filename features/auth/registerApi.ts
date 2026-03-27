const API = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (data: any) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};