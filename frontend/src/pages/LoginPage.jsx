import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.email.trim() || !form.password) {
            setError("El correo y la contraseña son requeridos");
            return;
        }

        setLoading(true);
        try {
            await login(form.email.trim(), form.password);
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
                    Iniciar sesión
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

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

                <div className="mb-6">
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D96C2C] text-white py-2 rounded hover:bg-[#3E8E7E] transition-colors cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>

                <p className="text-center text-sm text-[#3E8E7E] mt-4">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-[#274C56] font-semibold hover:underline">
                        Crear cuenta
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
