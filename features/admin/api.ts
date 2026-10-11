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

type AdminOverviewResponse = Omit<AdminOverview, "records"> & {
  records: {
    jobs: Array<Record<string, unknown>>;
    applications: Array<Record<string, unknown>>;
    users: Array<Record<string, unknown>>;
    companies: Array<Record<string, unknown>>;
  };
};

const getHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const stringValue = (value: unknown, fallback = "—") =>
  typeof value === "string" && value.trim() ? value : fallback;

const normalizeRecords = (
  records: Array<Record<string, unknown>>,
  section: AdminSection,
): AdminRecord[] =>
  records.map((record) => {
    const user = record.user as Record<string, unknown> | undefined;
    const job = record.job as Record<string, unknown> | undefined;
    const company = record.company as Record<string, unknown> | undefined;

    if (section === "jobs") {
      return {
        id: stringValue(record.id),
        name: stringValue(record.name ?? record.title),
        detail: stringValue(record.detail ?? record.description),
        status: stringValue(record.status) as AdminStatus,
        meta: stringValue(record.meta ?? company?.name),
        createdAt: stringValue(record.createdAt),
      };
    }

    if (section === "applications") {
      return {
        id: stringValue(record.id),
        name: stringValue(user?.email),
        detail: stringValue(job?.title),
        status: stringValue(record.status) as AdminStatus,
        meta: stringValue(record.coverLetter, "Application"),
        createdAt: stringValue(record.createdAt),
      };
    }

    if (section === "users") {
      return {
        id: stringValue(record.id),
        name: stringValue(record.email),
        detail: stringValue(record.role),
        status: stringValue(record.status) as AdminStatus,
        meta: stringValue(record.createdAt),
        createdAt: stringValue(record.createdAt),
      };
    }

    return {
      id: stringValue(record.id),
      name: stringValue(record.name),
      detail: stringValue(company?.owner ? "Company" : "Company"),
      status: stringValue(record.status) as AdminStatus,
      meta: stringValue(record.owner ? "Verified company" : "Company"),
      createdAt: stringValue(record.createdAt),
    };
  });

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

  const payload = (await response.json()) as AdminOverviewResponse;

  return {
    metrics: payload.metrics,
    records: {
      jobs: normalizeRecords(payload.records.jobs, "jobs"),
      applications: normalizeRecords(payload.records.applications, "applications"),
      users: normalizeRecords(payload.records.users, "users"),
      companies: normalizeRecords(payload.records.companies, "companies"),
    },
  };
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
