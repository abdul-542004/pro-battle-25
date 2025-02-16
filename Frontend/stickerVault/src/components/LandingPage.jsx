import React, { useEffect, useState } from "react";
import StickerCard from "./StickerCard";

const LandingPage = () => {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/stickers/");
        if (!response.ok) {
          throw new Error("Failed to fetch stickers");
        }
        const data = await response.json();
        setStickers(data.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStickers();
  }, []);

  if (loading) {
    return <p>Loading stickers...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Public Stickers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stickers.map((sticker) => (
          <StickerCard key={sticker.id} sticker={sticker} />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
