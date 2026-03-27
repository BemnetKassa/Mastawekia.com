const API = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (data: any) => {

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};