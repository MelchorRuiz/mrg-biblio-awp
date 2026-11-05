import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-6xl font-bold text-[#274C56] mb-4">404</h1>
            <p className="text-xl text-[#3E8E7E] mb-6">Página no encontrada</p>
            <Link
                to="/"
                className="bg-[#D96C2C] text-white px-6 py-2 rounded hover:bg-[#3E8E7E] transition-colors"
            >
                Ir al inicio
            </Link>
        </div>
    );
};

export default NotFoundPage;
