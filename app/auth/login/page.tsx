"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../features/auth/loginApi";



export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) {
        return null;
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

      return JSON.parse(atob(paddedBase64)) as Record<string, unknown>;
    } catch {
      return null;
    }
  };

  const resolveUserRole = (payload: any): string => {
    const tokenPayload =
      typeof payload?.access_token === "string"
        ? decodeJwtPayload(payload.access_token)
        : null;

    const rawRole =
      tokenPayload?.role ?? payload?.role ?? payload?.user?.role ?? payload?.data?.role;

    return typeof rawRole === "string" ? rawRole.trim().toUpperCase() : "";
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      if (typeof res?.access_token !== "string") {
        throw new Error("Login response is missing access token.");
      }

      const role = resolveUserRole(res);

      localStorage.setItem("token", res.access_token);
      alert("Logged in successfully!");

      if (role === "CLIENT") {
        router.push("/createJob");
      } else {
        router.push("/jobListing");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Invalid email or password.";
      alert(message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />

      <button onClick={handleLogin} className="bg-black text-white p-2">
        Login
      </button>
    </div>
  );
}