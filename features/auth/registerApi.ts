const API = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (data: any) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.status === 409) {
    throw new Error("email already exists.");
  } else if (res.status === 400) {
    throw new Error(
      "password must contain at least 6 caracter with number, letter and special character.",
    );
  }

  return res.json();
};
