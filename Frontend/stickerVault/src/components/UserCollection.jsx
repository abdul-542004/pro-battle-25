import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StickerCard from "./StickerCard";

const UserCollection = () => {
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get tokens from localStorage
    const getAccessToken = () => localStorage.getItem("access_token");
    const getRefreshToken = () => localStorage.getItem("refresh_token");

    // Function to refresh access token
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
                Authorization: `Bearer ${token}`,
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
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        return response;
    };

    useEffect(() => {
        const fetchUserStickers = async () => {
            try {
                const response = await fetchWithToken(
                    "http://127.0.0.1:8000/api/stickers/private/?format=json"
                );

                if (!response || !response.ok) {
                    throw new Error("Failed to fetch user stickers");
                }

                const data = await response.json();
                setStickers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStickers();
    }, []);

    if (loading) return <p>Loading your stickers...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 mt-24 relative">
            <h1 className="text-3xl font-bold mb-6 atma-bold text-center">
                Your Collection of Stickers🎨
            </h1>
            <div className="flex flex-wrap gap-4">
                {stickers.map((sticker) => (
                    <StickerCard key={sticker.id} sticker={sticker} />
                ))}
            </div>

            <Link 
                to="/create"
                className="atma-medium flex fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-pink-600 hover:from-yellow-500 hover:to-pink-700 text-white p-4 rounded-full shadow-lg transition"
            >
                <svg
                    className="mx-2"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#ffffff"
                >
                    <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
                Upload New Sticker

            </Link>

        </div>
    );
};

export default UserCollection;
