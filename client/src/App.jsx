import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";

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
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
