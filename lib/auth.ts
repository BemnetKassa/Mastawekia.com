export const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export const getUserRole = (token: string | null): string => {
  if (!token) return "";

  const payload = decodeJwtPayload(token);
  const role = payload?.role;

  return typeof role === "string" ? role.toUpperCase() : "";
};
