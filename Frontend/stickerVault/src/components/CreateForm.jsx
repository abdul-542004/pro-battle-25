import React, { useState } from 'react';
import axios from 'axios';

function StickerForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [isPrivate, setIsPrivate] = useState(true); // Default to private

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('tags', tags.split(',').map(tag => tag.trim()));
    formData.append('category', category.trim());
    formData.append('image', image);
    formData.append('is_private', isPrivate); // Include the is_private field

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/stickers/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      alert('Sticker created successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to create sticker.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Sticker</h2>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Description</label>
        <textarea
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Tags (comma-separated)</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Category</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Image</label>
        <input
          type="file"
          className="w-full p-2 rounded"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Privacy</label>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="private"
            name="privacy"
            value="true"
            checked={isPrivate === true}
            onChange={() => setIsPrivate(true)}
            className="mr-2"
          />
          <label htmlFor="private">Private</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="public"
            name="privacy"
            value="false"
            checked={isPrivate === false}
            onChange={() => setIsPrivate(false)}
            className="mr-2"
          />
          <label htmlFor="public">Public</label>
        </div>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Create Sticker
      </button>
    </form>
  );
}

export default StickerForm;
