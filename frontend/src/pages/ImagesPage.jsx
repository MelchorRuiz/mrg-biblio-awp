import { useEffect, useReducer } from "react";
import { ImageReducer, initialState } from "../reducers/ImageReducer";
import Alert from "../components/Alert";
import ImageForm from "../components/ImageForm";
import ImageTable from "../components/ImageTable";
import { API_URL } from "../config/api";

const ImagesPage = () => {
    const [state, dispatch] = useReducer(ImageReducer, initialState);

    const fetchImages = async () => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            const res = await fetch(`${API_URL}/images`);
            if (!res.ok) throw new Error("Error al cargar las imágenes");
            const data = await res.json();
            dispatch({ type: "GET_ALL", payload: data });
        } catch (error) {
            dispatch({
                type: "SET_ALERT",
                payload: { type: "error", message: error.message },
            });
            dispatch({ type: "SET_LOADING", payload: false });
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        if (state.alert) {
            const timer = setTimeout(() => {
                dispatch({ type: "CLEAR_ALERT" });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [state.alert]);

    const handleEdit = (image) => {
        dispatch({ type: "SET_EDITING", payload: image });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <Alert
                alert={state.alert}
                onClose={() => dispatch({ type: "CLEAR_ALERT" })}
            />

            <ImageForm
                key={state.editing ? state.editing.id : "new"}
                dispatch={dispatch}
                editing={state.editing}
            />

            {state.loading ? (
                <div className="text-center py-8 text-[#3E8E7E]">Cargando imágenes...</div>
            ) : (
                <ImageTable
                    images={state.images}
                    dispatch={dispatch}
                    onEdit={handleEdit}
                />
            )}
        </div>
    );
};

export default ImagesPage;
