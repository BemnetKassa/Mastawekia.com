import { useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data?.user || null;

      if (token) {
        // set token in axios instance if helper exists
        if (typeof api.setToken === "function") api.setToken(token);
        localStorage.setItem("token", token);
      }

      // update auth context
      authLogin({ user, token });
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <form className="card w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full mb-4" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full mb-4" />

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );

}
