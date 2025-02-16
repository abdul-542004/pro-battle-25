import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const StickerDetailPage = () => {
    const { id } = useParams();
    const [sticker, setSticker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchSticker = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/stickers/${id}?format=json`);
          if (!response.ok) {
            throw new Error("Sticker not found");
          }
          const data = await response.json();
          setSticker(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSticker();
    }, [id]);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold">{sticker.name}</h1>
        <img
          src={sticker.image}
          alt={sticker.name}
          className="w-full rounded-lg my-4"
        />
        <p className="text-gray-700">{sticker.description}</p>
        <p className="font-semibold mt-4">Category: {sticker.category}</p>
        
        {/* Tags displayed with hashtags and space-separated */}
        <div className="mt-2">
          <span className="font-semibold">Tags: </span>
          {sticker.tags.map((tag, index) => (
            <span key={index} className="text-blue-600 mr-2">
              #{tag}
            </span>
          ))}
        </div>
  
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={() => window.open(sticker.image, "_blank")}
        >
          Download Sticker
        </button>
      </div>
    );
  };
  
  export default StickerDetailPage;
  