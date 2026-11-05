import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch(`${API_URL}/images`);
                if (!res.ok) throw new Error("Error al cargar las imágenes");
                const data = await res.json();
                setImages(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (loading) {
        return <p className="text-xl font-medium text-[#3E8E7E]">Cargando...</p>;
    }

    if (images.length === 0) {
        return <p className="text-xl font-medium text-[#3E8E7E]">No hay imágenes disponibles</p>;
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
                <div key={image.id} className="group relative overflow-hidden rounded-lg">
                    <img
                        src={image.url}
                        alt={image.title}
                        className="object-cover h-full w-full hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 className="text-white font-semibold">{image.title}</h3>
                        <p className="text-white/80 text-sm">{image.category}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Gallery;
