import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const StickerDetailPage = () => {
    const { id } = useParams();
    const [sticker, setSticker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1; // Replace with the actual logged-in user's ID

    // Get tokens from localStorage
    const getAccessToken = () => localStorage.getItem("access_token");
    const getRefreshToken = () => localStorage.getItem("refresh_token");

    // Function to refresh the access token
    const refreshAccessToken = async () => {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            console.error("No refresh token available. Logging out.");
            logoutUser();
            return null;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) {
                console.error("Failed to refresh token. Logging out.");
                logoutUser();
                return null;
            }

            const data = await response.json();
            localStorage.setItem("access_token", data.access);
            return data.access;
        } catch (error) {
            console.error("Error refreshing token:", error);
            logoutUser();
            return null;
        }
    };

    // Function to log out the user
    const logoutUser = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setError("Session expired. Please log in again.");
    };

    // Function to fetch data with token handling
    const fetchWithToken = async (url, options = {}) => {
        let token = getAccessToken();
        let response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            console.log("Access token expired, attempting refresh...");
            token = await refreshAccessToken();
            if (!token) return null;

            // Retry request with new token
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": `Bearer ${token}`,
                },
            });
        }

        return response;
    };

    // Fetch sticker details
    useEffect(() => {
        const fetchSticker = async () => {
            try {
                const response = await fetchWithToken(`http://127.0.0.1:8000/api/stickers/${id}?format=json`);
                
                if (!response || !response.ok) {
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
            const response = await fetchWithToken(`http://127.0.0.1:8000/api/stickers/${stickerId}/like/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (response && response.ok) {
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
        <div className="max-w-2xl mx-auto p-6 mt-24">
            <h1 className="text-center atma-medium text-2xl font-bold">{sticker.name}</h1>
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

            {/* Number of Likes */}
            <p className="mt-4 text-gray-700">Likes: {sticker.likes.length}</p>
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
