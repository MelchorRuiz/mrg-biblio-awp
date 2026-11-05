import { useState } from "react";
import { API_URL } from "../config/api";

const getInitialForm = (editing) => ({
    title: editing?.title || "",
    description: editing?.description || "",
    url: editing?.url || "",
    category: editing?.category || "",
    author: editing?.author || "",
});

const ImageForm = ({ dispatch, editing }) => {
    const [form, setForm] = useState(getInitialForm(editing));
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = "El título es obligatorio";
        if (!form.description.trim()) newErrors.description = "La descripción es obligatoria";
        if (!form.url.trim()) newErrors.url = "La URL es obligatoria";
        if (!form.category.trim()) newErrors.category = "La categoría es obligatoria";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            url: form.url.trim(),
            category: form.category.trim(),
            author: form.author.trim(),
        };

        try {
            if (editing) {
                const res = await fetch(`${API_URL}/images/${editing.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Error al actualizar la imagen");
                const data = await res.json();
                dispatch({ type: "UPDATE", payload: data });
                dispatch({
                    type: "SET_ALERT",
                    payload: { type: "success", message: "Imagen actualizada exitosamente" },
                });
                dispatch({ type: "SET_EDITING", payload: null });
            } else {
                const res = await fetch(`${API_URL}/images`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Error al crear la imagen");
                const data = await res.json();
                dispatch({ type: "ADD", payload: data });
                dispatch({
                    type: "SET_ALERT",
                    payload: { type: "success", message: "Imagen agregada exitosamente" },
                });
            }
            setForm({ title: "", description: "", url: "", category: "", author: "" });
            setErrors({});
        } catch (error) {
            dispatch({
                type: "SET_ALERT",
                payload: { type: "error", message: error.message },
            });
        }
    };

    const handleCancel = () => {
        dispatch({ type: "SET_EDITING", payload: null });
        setForm({ title: "", description: "", url: "", category: "", author: "" });
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E7A84E] rounded-lg p-6 mb-6 shadow-sm" noValidate>
            <h2 className="text-xl font-semibold text-[#274C56] mb-4">
                {editing ? "Editar Imagen" : "Nueva Imagen"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#3E8E7E] mb-1">
                        Título
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E7A84E] ${errors.title ? "border-red-500" : "border-[#E7A84E]"}`}
                    />
                    {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#3E8E7E] mb-1">
                        Categoría
                    </label>
                    <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E7A84E] ${errors.category ? "border-red-500" : "border-[#E7A84E]"}`}
                    />
                    {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#3E8E7E] mb-1">
                        Descripción
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={2}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E7A84E] ${errors.description ? "border-red-500" : "border-[#E7A84E]"}`}
                    />
                    {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#3E8E7E] mb-1">
                        Autor (opcional)
                    </label>
                    <input
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        className="w-full border border-[#E7A84E] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E7A84E]"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#3E8E7E] mb-1">
                        URL de la imagen
                    </label>
                    <input
                        type="text"
                        name="url"
                        value={form.url}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E7A84E] ${errors.url ? "border-red-500" : "border-[#E7A84E]"}`}
                    />
                    {errors.url && <p className="text-red-600 text-xs mt-1">{errors.url}</p>}
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    type="submit"
                    className="bg-[#D96C2C] text-white px-6 py-2 rounded hover:bg-[#3E8E7E] transition-colors cursor-pointer"
                >
                    {editing ? "Guardar Cambios" : "Agregar Imagen"}
                </button>
                {editing && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default ImageForm;
