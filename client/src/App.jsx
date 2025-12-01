import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import News from "./pages/News";
import Profile from "./pages/Profile";
import PostJob from "./pages/PostJob";
import PostNews from "./pages/PostNews";

function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <Link to="/" className="font-bold">Mastawekia</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span>👤 {user.name} ({user.role})</span>
            <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/jobs" className="hover:underline">Jobs</Link>
            <Link to="/news" className="hover:underline">News</Link>
            <Link to="/register" className="hover:underline">Register</Link>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <Link to="/post-job" className="hover:underline">Post Job</Link>
            <Link to="/post-news" className="hover:underline">Post News</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/post-news" element={<PostNews />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}