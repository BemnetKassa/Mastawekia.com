export type AdminStatus = "ACTIVE" | "PENDING" | "SUSPENDED";
export type AdminSection = "jobs" | "applications" | "users" | "companies";

export type AdminRecord = {
  id: string;
  name: string;
  detail: string;
  status: AdminStatus;
  meta: string;
  createdAt: string;
};

export type AdminOverview = {
  metrics: {
    totalUsers: number;
    activeJobs: number;
    applications: number;
    companies: number;
  };
  records: Record<AdminSection, AdminRecord[]>;
};

const API = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

export async function getAdminOverview(): Promise<AdminOverview> {
  if (!API) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${API}/admin/overview`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Admin overview request failed (${response.status}).`);
  }

  return response.json();
}

export async function updateAdminRecord(
  section: AdminSection,
  id: string,
  status: AdminStatus,
) {
  if (!API) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${API}/admin/${section}/${id}`, {
    method: "PATCH",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Could not update ${section.slice(0, -1)} (${response.status}).`);
  }

  return response.json();
}
