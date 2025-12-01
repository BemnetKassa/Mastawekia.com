import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="p-4 bg-blue-600 text-white flex items-center justify-between">
      <Link to="/" className="font-bold text-lg">Mastawekia</Link>

      <div className="flex items-center space-x-4">
        <Link to="/jobs" className="hover:underline">Jobs</Link>
        <Link to="/news" className="hover:underline">News</Link>

        {user ? (
          <>
            <span className="hidden sm:inline">👤 {user.name} ({user.role})</span>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded ml-2">Logout</button>
          </>
        ) : (
          <>
            <Link to="/register" className="hover:underline">Register</Link>
            <Link to="/login" className="hover:underline">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}