import { NavLink } from "react-router-dom";
import { LayoutGrid } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-sm">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <LayoutGrid className="w-6 h-6 text-purple-400" />
        <span className="text-xl font-semibold text-purple-400">DataGENIE</span>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `text-white hover:text-purple-400 transition ${
              isActive ? "text-purple-400" : ""
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/generator"
          className={({ isActive }) =>
            `text-white hover:text-purple-400 transition ${
              isActive ? "text-purple-400" : ""
            }`
          }
        >
          Generator
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `text-white hover:text-purple-400 transition ${
              isActive ? "text-purple-400" : ""
            }`
          }
        >
          Contact
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
