import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [message, setMessage] = useState("");

  async function handleRegister(formData) {
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Registration successful! You can now log in.");
      window.location.href = "/login";
    } else {
      setMessage(data.error || "Registration failed.");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-fixed bg-no-repeat bg-cover"
      style={{ backgroundImage: `url('/public/background.png')` }}
    >
      <div className="bg-gradient-to-r from-yellow-300 to-pink-500 p-8 rounded-xl shadow-xl w-96 text-white border-4 border-amber-400">
        <h2 className="text-3xl font-bold mb-6 drop-shadow-md font-fuzzybubbles text-center">
          🌟 Create Your StickerVault Account
        </h2>
        <form action={handleRegister}>
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
            <label className="block text-white text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-300"
              placeholder="Enter your email"
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
            Register 🎉
          </button>
        </form>
        {message && <p className="text-sm text-center mt-4">{message}</p>}
        <p className="text-sm text-white text-center mt-4">
          Already have an account? <Link to="/login" className="text-yellow-300 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
