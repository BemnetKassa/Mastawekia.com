import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Mastawekia
        </Link>

        <nav className="space-x-4">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
            Home
          </NavLink>
          <NavLink to="/jobs" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
            Jobs
          </NavLink>
          <NavLink to="/news" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
            News
          </NavLink>
        </nav>

        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-gray-700">{user.name || user.email}</Link>
              <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-gray-700">Login</Link>
              <Link to="/register" className="px-3 py-1 bg-blue-600 text-white rounded">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
