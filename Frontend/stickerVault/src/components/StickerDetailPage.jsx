import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const StickerDetailPage = () => {
    const { id } = useParams();
    const [sticker, setSticker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1; // Replace with actual logged-in user's ID (dynamic)
    
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    const fetchSticker = async (retry = true) => {
        try {
            const headers = accessToken ? { "Authorization": `Bearer ${accessToken}` } : {};

            let response = await fetch(`http://127.0.0.1:8000/api/stickers/${id}?format=json`, { headers });

            if (response.status === 401 && retry && refreshToken) {
                // Attempt to refresh the token
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    return fetchSticker(false); // Retry request with new token
                }
            }

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

    const refreshAccessToken = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("access_token", data.access);
                return data.access;
            } else {
                console.error("Refresh token expired. Logging out.");
                handleLogout();
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            handleLogout();
        }
        return null;
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    };

    useEffect(() => {
        fetchSticker();
    }, [id, accessToken]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 mt-24 ">
            <h1 className=" font-bold atma-bold text-center text-3xl">{sticker.name}</h1>
            <img src={sticker.image} alt={sticker.name} className="w-full rounded-lg my-4" />
            <p className="text-gray-700">{sticker.description}</p>
            <p className="font-semibold mt-4">Category: {sticker.category}</p>
        </div>
    );
};

export default StickerDetailPage;
