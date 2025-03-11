import React, { useEffect, useState } from "react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

import StickerCard from "./StickerCard";

const Trending = () => {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingStickers = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/stickers/trending?format=json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trending stickers");
        }
        const data = await response.json();
        setStickers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingStickers();
  }, []);

  useEffect(() => {
    if (stickers.length > 0) {
      const glide = new Glide(".glide", {
        type: "carousel",
        startAt: 0,
        perView: 3,
        gap: 20,
        breakpoints: {
          1024: { perView: 2 },
          768: { perView: 1 },
        },
      });
      glide.mount();
    }
  }, [stickers]);

  if (loading) {
    return <p className="text-center text-lg font-semibold">Loading trending stickers...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen bg-yellow-200">
      <section className="p-6 mt-1.5">
        <h3 className="text-3xl font-bold mb-6 mt-16">🔥 Trending Stickers</h3>

        {/* GlideJS Slider */}
        <div className="glide">
          <div className="glide__track" data-glide-el="track">
            <div className="glide__slides">
              {stickers.map((sticker, index) => (
                <div className="glide__slide relative" key={sticker.id}>
                  {/* Ranking Number */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white font-extrabold text-xl w-10 h-10 flex items-center justify-center rounded-full shadow-lg">
                    {index + 1}
                  </div>

                  <StickerCard sticker={sticker} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="glide__arrows absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2" data-glide-el="controls">

            <button className="glide__arrow glide__arrow--left bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-md" data-glide-dir="<">
              ◀
            </button>
            <button className="glide__arrow glide__arrow--right bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-md" data-glide-dir=">">
              ▶
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trending;
