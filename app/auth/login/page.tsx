"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../features/auth/loginApi";



export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await loginUser({ email, password });

    localStorage.setItem("token", res.access_token);

    alert("Logged in successfully!");

    router.push("/jobsListing")
  }

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