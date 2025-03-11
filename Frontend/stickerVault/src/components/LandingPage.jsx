import React, { useEffect, useState, useRef } from "react";
import StickerCard from "./StickerCard";
import Navbar from "./Navbar";
import Button from "./Button";

const LandingPage = () => {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/stickers/?search=${searchQuery}`);
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
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) {
    return <p>Loading stickers...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="min-h-screen bg-yellow-200">
      

      {/* Hero Section */}
      <section
        className="flex flex-col items-center text-center py-24 bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/path-to-background.png')" }}
      >
        <h2 className="text-5xl font-bold mb-6 font-funky">
          Discover, Collect & Share Stickers!
        </h2>
        <input
          type="text"
          placeholder="Search Stickers..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mt-4 px-4 py-2 rounded-lg shadow-md w-1/2 bg-amber-100"
        />
        <div className="mt-4">
          <Button className="bg-pink-600 text-white hover:bg-pink-700 px-4 py-2 rounded-lg transition">
            Explore Stickers
          </Button>
          <Button className="ml-2 bg-yellow-500 text-white hover:bg-yellow-600 px-4 py-2 rounded-lg transition">
            Create Your Collection
          </Button>
        </div>
      </section>

      {/* Trending Stickers */}
      <section className="p-6 -mt-1.5">
        <h3 className="text-3xl font-bold mb-4">🔥 Trending Stickers</h3>
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-700 text-white px-3 py-2 rounded-l z-10"
            onClick={scrollLeft}
          >
            ◀
          </button>

          {/* Stickers Container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-scroll space-x-4 p-4 scroll-smooth"
          >
            {stickers.map((sticker) => (
              <StickerCard key={sticker.id} sticker={sticker} />
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-700 text-white px-3 py-2 rounded-r z-10"
            onClick={scrollRight}
          >
            ▶
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="p-6">
        <h3 className="text-3xl font-bold mb-4">🎭 Categories</h3>
        <div className="grid grid-cols-4 gap-4">
          <Button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg transition">Memes</Button>
          <Button className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded-lg transition">Anime</Button>
          <Button className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg transition">Emoji</Button>
          <Button className="bg-green-400 hover:bg-green-500 px-4 py-2 rounded-lg transition">Gaming</Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
