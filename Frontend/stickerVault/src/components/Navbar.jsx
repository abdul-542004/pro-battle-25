import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";


/*
  Login button should only be visible when the user is not logged in.
  Register button should only be visible when the user is not registered.
  My Collection button should only be visible when the user is logged in.
*/

const Navbar = ({ darkMode, setDarkMode }) => {

  let isLoggedIn = localStorage.getItem("access_token") ? true : false;
  
  return (
    <nav className="bg-gradient-to-r from-yellow-400 to-pink-600 fixed top-0 left-0 w-full bg-opacity-80 text-white py-4 px-8 flex justify-between z-50 shadow-md">
      <h1 className="text-2xl font-bold atma-bold">StickerVault 🚀</h1>
      <div className="flex gap-4">
        <Link to="/" className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">Home</Link>
        <Link to="/trending" className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">Trending</Link>
        <Link to="/categories" className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">Categories</Link>
        {isLoggedIn? 
          <Link to="collection" className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">My Collection</Link>
          : null
        }
        
        {isLoggedIn? 
        <button 
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.reload();
            window.location.href = "/";
          }}
          className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700"
        >
          Logout
        </button> : 
        
        <Link 
          to="/login" 
          className="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700"
        >
          Sign In/Up
        
        </Link>}
        <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-2">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;