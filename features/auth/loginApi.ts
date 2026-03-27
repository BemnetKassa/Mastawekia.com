const API = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};