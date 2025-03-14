import React from "react";
import { Link,useLocation } from "react-router-dom";

const StickerCard = ({ sticker }) => {

  const location = useLocation();
  
  
  return (
    <Link to={`/stickers/${sticker.id}`} className="block">
      <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center w-56 h-auto min-h-[80px]">
        <img
          src={sticker.image}
          alt={sticker.name}
          className="w-40 h-auto object-contain rounded-lg"
        />
        <div className="p-4">
          <h4 className="text-lg font-bold mt-2">{sticker.name}</h4>
          <p className="text-sm text-gray-500">{location.pathname == '/categories'?null:sticker.category}</p>
          
        </div>
      </div>
    </Link>
  );
};

export default StickerCard;
