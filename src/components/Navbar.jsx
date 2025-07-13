import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-red-500">BookMyShow</Link>
      <div className="space-x-4">
        <Link to="/" className="hover:text-red-400">Home</Link>
         <Link to="/my-bookings" className="hover:text-red-400">My Bookings</Link>
        <Link to="/login" className="hover:text-red-400">Login</Link>

      </div>
    </nav>
  );
}
