import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const StickerDetailPage = () => {
    const { id } = useParams();
    const [sticker, setSticker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1; // Replace with the actual logged-in user's ID (dynamic)

    const yourToken = localStorage.getItem("access_token");

    // Fetch sticker details
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

    // Like or unlike the sticker
    const likeSticker = async (stickerId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/stickers/${stickerId}/like/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${yourToken}`,  // Token for authentication
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                console.log("Sticker liked/unliked successfully!");

                // Toggle the like status in the UI
                setSticker((prevSticker) => ({
                    ...prevSticker,
                    likes: prevSticker.likes.includes(userId)
                        ? prevSticker.likes.filter((id) => id !== userId) // Unlike
                        : [...prevSticker.likes, userId], // Like
                }));
            } else {
                console.error("Failed to like/unlike sticker");
            }
        } catch (error) {
            console.error("Error liking/unliking sticker:", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const isLiked = sticker && sticker.likes.includes(userId);

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

            {/* Tags */}
            <div className="mt-2">
                <span className="font-semibold">Tags: </span>
                {sticker.tags.map((tag, index) => (
                    <span key={index} className="text-blue-600 mr-2">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Like Button */}
            <button
                className="mt-4 ml-4 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 flex items-center"
                onClick={() => likeSticker(sticker.id)}
            >
                <img
                    src={
                        isLiked
                            ? "http://127.0.0.1:8000/media/stickers/liked-icon.png"
                            : "http://127.0.0.1:8000/media/stickers/not-liked-icon.png"
                    }
                    alt={isLiked ? "Liked" : "Not Liked"}
                    className="w-6 h-6 mr-2"
                />
                {isLiked ? "Unlike" : "Like"}
            </button>
        </div>
    );
};

export default StickerDetailPage;
