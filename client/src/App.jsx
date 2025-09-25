import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import News from "./pages/News";
import Profile from "./pages/Profile";
import PostJob from "./pages/PostJob";


function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
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
            
            </>
          )}
        </div>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post-job" element={<PostJob />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
