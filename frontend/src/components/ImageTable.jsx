import { API_URL } from "../config/api";

const ImageTable = ({ images, dispatch, onEdit }) => {

    const handleDelete = async (id, title) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${title}"?`)) return;

        try {
            const res = await fetch(`${API_URL}/images/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Error al eliminar la imagen");
            dispatch({ type: "DELETE", payload: id });
            dispatch({
                type: "SET_ALERT",
                payload: { type: "success", message: "Imagen eliminada exitosamente" },
            });
        } catch (error) {
            dispatch({
                type: "SET_ALERT",
                payload: { type: "error", message: error.message },
            });
        }
    };

    if (images.length === 0) {
        return (
            <div className="bg-white border border-[#E7A84E] rounded-lg p-8 text-center text-[#3E8E7E]">
                No hay imágenes registradas
            </div>
        );
    }

    return (
        <div className="bg-white border border-[#E7A84E] rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
                <thead className="bg-[#274C56] text-white">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm">ID</th>
                        <th className="px-4 py-3 text-left text-sm">Imagen</th>
                        <th className="px-4 py-3 text-left text-sm">Título</th>
                        <th className="px-4 py-3 text-left text-sm">Categoría</th>
                        <th className="px-4 py-3 text-left text-sm">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {images.map((image) => (
                        <tr
                            key={image.id}
                            className="border-t border-[#F6E2B3] hover:bg-[#F6E2B3]/30 transition-colors"
                        >
                            <td className="px-4 py-3 text-sm text-[#274C56]">{image.id}</td>
                            <td className="px-4 py-3">
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            </td>
                            <td className="px-4 py-3">
                                <div className="text-sm font-medium text-[#274C56]">{image.title}</div>
                                <div className="text-xs text-[#3E8E7E]">{image.description}</div>
                            </td>
                            <td className="px-4 py-3">
                                <span className="bg-[#F6E2B3] text-[#D96C2C] text-xs px-2 py-1 rounded-full">
                                    {image.category}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(image)}
                                        className="bg-[#E7A84E] text-white px-3 py-1 rounded text-sm hover:bg-[#D96C2C] transition-colors cursor-pointer"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id, image.title)}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors cursor-pointer"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ImageTable;
