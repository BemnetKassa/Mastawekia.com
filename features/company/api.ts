const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getMyCompanies = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(`${API}/company/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Fetch companies error:", res.status, errorText);
    throw new Error(`Failed to fetch companies: ${res.status} ${errorText}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

export const createCompany = async (data: {
  name: string;
  description: string;
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(`${API}/company`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create company error:", res.status, errorText);
    throw new Error(`Failed to create company: ${res.status} ${errorText}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
};
