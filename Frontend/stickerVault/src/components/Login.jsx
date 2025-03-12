import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [message, setMessage] = useState("");

  async function handleLogin(formData) {
    const response = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setMessage("Login successful!");
      window.location.href = "/";
    } else {
      setMessage(data.detail || "Login failed.");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-fixed bg-no-repeat bg-cover"
      style={{ backgroundImage: `url('/public/background.png')` }}
    >
      <div className="bg-gradient-to-r from-yellow-300 to-pink-500 p-8 rounded-xl shadow-xl w-96 text-white border-4 border-amber-400">
        <h2 className="text-3xl font-bold mb-6 drop-shadow-md font-fuzzybubbles text-center">
          🚀 Welcome to StickerVault
        </h2>
        <form action={handleLogin}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-300"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-lg hover:scale-105"
          >
            Login 🔥
          </button>
        </form>
        {message && <p className="text-sm text-center mt-4">{message}</p>}
        <p className="text-sm text-white text-center mt-4">
          Don't have an account? <Link to="/register" className="text-yellow-300 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
