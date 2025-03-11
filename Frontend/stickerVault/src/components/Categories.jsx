import React, { useEffect, useState } from "react";
import StickerCard from "./StickerCard";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/stickers-by-category/?format=json");
                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    console.log(categories.stickers)

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Stickers by Category</h1>
            {categories.map((category, index) => (
                <div key={index} className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
                    <div className="flex flex-wrap gap-4">
                        {category.stickers.map((sticker) => (
                            <StickerCard key={sticker.id} sticker={sticker} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Categories;
