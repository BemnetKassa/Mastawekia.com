const API = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (data: any) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const backendMessage = payload?.message;
    const message = Array.isArray(backendMessage)
      ? backendMessage.join(", ")
      : backendMessage;

    if (res.status === 409) {
      throw new Error("Email already exists.");
    }

    throw new Error(message || `Registration failed: ${res.status}`);
  }

  return res.json();
};
