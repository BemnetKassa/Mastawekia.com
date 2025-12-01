import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NavBar, Footer } from "./components";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import News from "./pages/News";
import Profile from "./pages/Profile";
import PostJob from "./pages/PostJob";
import PostNews from "./pages/PostNews";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <main className="p-6">
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
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}