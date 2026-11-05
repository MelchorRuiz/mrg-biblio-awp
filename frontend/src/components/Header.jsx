import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header className="bg-[#274C56] text-white py-4 shadow-md">
            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
                <Link to="/">
                    <div>
                        <h1 className="text-2xl font-bold">Galería de Imágenes</h1>
                        <p className="text-[#E7A84E] text-sm">Sistema de administración</p>
                    </div>
                </Link>

                <nav className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/images" className="text-[#E7A84E] hover:text-white transition-colors">
                                Imágenes
                            </Link>
                            <span className="text-[#F6E2B3] text-sm">{user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-[#D96C2C] hover:bg-[#3E8E7E] px-4 py-1 rounded text-sm transition-colors cursor-pointer"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-[#E7A84E] hover:text-white transition-colors">
                                Iniciar sesión
                            </Link>
                            <Link
                                to="/register"
                                className="bg-[#D96C2C] hover:bg-[#3E8E7E] px-4 py-1 rounded text-sm transition-colors"
                            >
                                Crear cuenta
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
