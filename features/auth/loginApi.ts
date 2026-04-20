const API = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.status === 404) {
    throw new Error("invalid email or password.");
  } else if (res.status === 500) {
    throw new Error("Server error. Please try again later.");
  }

  return res.json();
};
