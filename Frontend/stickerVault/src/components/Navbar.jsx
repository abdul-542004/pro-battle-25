import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav className="bg-gradient-to-r from-yellow-400 to-pink-600 fixed top-0 left-0 w-full bg-opacity-80 text-white py-4 px-8 flex justify-between z-50 shadow-md">
      <h1 className="text-2xl font-bold">StickerVault 🚀</h1>
      <div className="flex gap-4">
        <Link to="/" className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">Home</Link>
        <Link to="/trending" className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">Trending</Link>
        <Link to="/categories" className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">Categories</Link>
        <Link to="collection" className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">My Collection</Link>
        <Link to="/login" className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">Login</Link>
        <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-2">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;