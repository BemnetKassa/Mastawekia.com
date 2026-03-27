"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../features/auth/api";


export default function RegisterPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const handleRegister = async () => {
    await registerUser({ email, password, role });
    alert("Regisered successfully!");
    router.push("/login");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <input
        placeholder="Email"
        type="email"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        className="border p-2 w-full mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 w-full mb-2"
        value={role}
      >
        <option value="USER">User</option>
        <option value="CLIENT">Client</option>
      </select>
      <button className="bg-black text-white p-2 w-full">Register</button>
    </div>
  )
}