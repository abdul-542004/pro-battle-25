import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    is_private: true,
    image: null,
  });

  navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("is_private", formData.is_private);
    data.append("image", formData.image);
    data.append("category", formData.category);

    // Send tags as an array
    formData.tags.split(",").forEach((tag) => data.append("tags", tag.trim()));

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/stickers/create/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Sticker created successfully!");
      console.log("Sticker created:", response.data);
      // redirect to my collection component
      navigate("/collection");
    } catch (error) {
      alert("Error creating sticker. Please try again.");
      console.error("Error creating sticker:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl mt-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create a New Sticker</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sticker Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sticker Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Private Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Private</label>
          <select
            name="is_private"
            value={formData.is_private}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Create Sticker
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
