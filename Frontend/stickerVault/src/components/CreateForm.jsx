import React from "react";
import axios from "axios";

function StickerForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("tags", formData.get("tags").split(",").map(tag => tag.trim()));
    formData.set("is_private", formData.get("is_private") === "true");

    try {
      await axios.post("http://127.0.0.1:8000/api/stickers/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      alert("Sticker created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create sticker.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-24 max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Sticker</h2>
      {[
        { label: "Name", name: "name", type: "text", required: true },
        { label: "Description", name: "description", type: "textarea" },
        { label: "Tags (comma-separated)", name: "tags", type: "text" },
        { label: "Category", name: "category", type: "text" },
        { label: "Image", name: "image", type: "file", required: true },
      ].map(({ label, name, type, required }) => (
        <div key={name} className="mb-4">
          <label className="block mb-2 font-bold">{label}</label>
          {type === "textarea" ? (
            <textarea name={name} className="w-full p-2 border rounded" />
          ) : (
            <input type={type} name={name} className="w-full p-2 border rounded" required={required} />
          )}
        </div>
      ))}
      <div className="mb-4">
        <label className="block mb-2 font-bold">Privacy</label>
        {[{ id: "private", value: "true", label: "Private" }, { id: "public", value: "false", label: "Public" }].map(({ id, value, label }) => (
          <div key={id} className="flex items-center mb-2">
            <input type="radio" id={id} name="is_private" value={value} defaultChecked={value === "true"} className="mr-2" />
            <label htmlFor={id}>{label}</label>
          </div>
        ))}
      </div>
      <button type="submit" className="atma-medium px-4 py-2 bg-gradient-to-r from-yellow-400 to-pink-600 hover:from-yellow-500 hover:to-pink-700 text-white rounded ">
        Upload Sticker
      </button>
    </form>
  );
}

export default StickerForm;