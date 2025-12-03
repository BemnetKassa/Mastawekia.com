import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name:"", email:"", password:"" });
  const handleChange = (e) => setFormData({...formData,[e.target.name]:e.target.value});
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try{ await api.post("/auth/register", formData); navigate("/login"); }
    catch(err){ console.error(err.response?.data || err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-4">
        <h2 className="text-3xl font-bold text-center text-blue-600">Create an Account</h2>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"/>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Register</button>
      </form>
    </div>
  );
}
