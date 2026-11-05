export const ImageReducer = (state, action) => {
    switch (action.type) {
        case "GET_ALL":
            return { ...state, images: action.payload, loading: false };
        case "ADD":
            return { ...state, images: [...state.images, action.payload] };
        case "UPDATE":
            return {
                ...state,
                images: state.images.map((img) =>
                    img.id === action.payload.id ? action.payload : img
                ),
            };
        case "DELETE":
            return {
                ...state,
                images: state.images.filter((img) => img.id !== action.payload),
            };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_ALERT":
            return { ...state, alert: action.payload };
        case "CLEAR_ALERT":
            return { ...state, alert: null };
        case "SET_EDITING":
            return { ...state, editing: action.payload };
        default:
            return state;
    }
};

export const initialState = {
    images: [],
    loading: true,
    alert: null,
    editing: null,
};
