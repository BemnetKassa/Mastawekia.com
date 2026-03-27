"use client";

import { useState } from "react";



export default function LoginPage() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input placeholder="Email" className="border p-2 w-full mb-2" />
      <input placeholder="Password" type="password" className="border p-2 w-full mb-2" />
      <button className="bg-black text-white p-2 w-full">Login</button>
    </div>
  );
}