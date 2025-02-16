import React from "react";
import { Link } from "react-router-dom";

const StickerCard = ({ sticker }) => {
  return (
    <Link to={`/stickers/${sticker.id}`} className="block">
      <div className="border rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200">
        <img
          src={sticker.image}
          alt={sticker.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">{sticker.name}</h2>
          <p className="text-sm text-gray-500">{sticker.category}</p>
          
        </div>
      </div>
    </Link>
  );
};

export default StickerCard;
