import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';


import fileDownload from 'js-file-download';


const StickerDetailPage = () => {
    const { id } = useParams();
    const [sticker, setSticker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1; // Replace with actual user ID

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

    const handleLikeToggle = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/stickers/${id}/like/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ user_id: userId }),
            });
            if (!response.ok) {
                throw new Error("Failed to update like status");
            }
            const updatedSticker = await response.json();
            setSticker(updatedSticker);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const isLiked = sticker.likes.includes(userId);

    

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

            


            {/* Like button */}
            <button
                className="mt-4 ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleLikeToggle}
            >
                <img
                    src={isLiked ? 'http://127.0.0.1:8000/media/stickers/liked-icon.png' : 'http://127.0.0.1:8000/media/stickers/not-liked-icon.png'}
                    alt={isLiked ? 'Liked' : 'Not Liked'}
                    className="w-6 h-6"
                />
            </button>
        </div>
    );
};

export default StickerDetailPage;


