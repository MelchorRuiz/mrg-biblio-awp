import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import Gallery from "../components/Gallery";

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#274C56] mb-4">Bienvenido a la Galería de Imágenes</h2>
                <p className="text-[#3E8E7E] mb-6">
                    Sistema de administración de imágenes
                </p>

                {!isAuthenticated && (
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/login"
                            className="bg-[#D96C2C] text-white px-6 py-3 rounded hover:bg-[#3E8E7E] transition-colors"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            to="/register"
                            className="bg-white border border-[#D96C2C] text-[#D96C2C] px-6 py-3 rounded hover:bg-[#F6E2B3] transition-colors"
                        >
                            Crear cuenta
                        </Link>
                    </div>
                )}
            </div>

            <Gallery />
        </div>
    );
};

export default HomePage;
