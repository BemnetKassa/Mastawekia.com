import { useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState("");

  const handleChange = (e) => setFormData({...formData,[e.target.name]:e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      const token = res.data?.token; const user = res.data?.user;
      if(token){localStorage.setItem("token",token);}
      authLogin({ user, token });
      navigate("/profile");
    } catch(err){
      setError(err?.response?.data?.message || "Login failed");
    } finally{ setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-4">
        <h2 className="text-3xl font-bold text-center text-blue-600">Login</h2>
        {error && <p className="text-red-600">{error}</p>}
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"/>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"/>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">{loading?"Logging in...":"Login"}</button>
      </form>
    </div>
  );
}
