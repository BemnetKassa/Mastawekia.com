import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", formData);
      console.log("Registered:", res.data);
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <form className="card w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="w-full mb-4" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full mb-4" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full mb-4" />

        <button className="btn-primary w-full">Register</button>
      </form>
    </div>
  );

}
