import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.name.trim() || !form.email.trim() || !form.password) {
            setError("Todos los campos son requeridos");
            return;
        }
        if (form.password.length < 6) {
            setError("La contraseña debe ser de almenos 6 caracteres");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            await register(form.name.trim(), form.email.trim(), form.password);
            navigate("/images");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-[#E7A84E] rounded-lg p-6 w-full max-w-md shadow-sm"
            >
                <h2 className="text-2xl font-semibold text-[#274C56] mb-4 text-center">
                    Crear cuenta
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-[#3E8E7E] mb-1">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border border-[#E7A84E] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E7A84E]"
                        placeholder="Tu nombre"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-[#3E8E7E] mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-[#E7A84E] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E7A84E]"
                        placeholder="tu@email.com"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-[#3E8E7E] mb-1">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-[#E7A84E] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E7A84E]"
                        placeholder="••••••••"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#3E8E7E] mb-1">
                        Confirmar contraseña
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full border border-[#E7A84E] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E7A84E]"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D96C2C] text-white py-2 rounded hover:bg-[#3E8E7E] transition-colors cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>

                <p className="text-center text-sm text-[#3E8E7E] mt-4">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-[#274C56] font-semibold hover:underline">
                        Iniciar sesión
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
