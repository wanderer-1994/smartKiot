import { createStore } from "redux";

const initialState = {
    // admin: {
    //     admin_id: 1,
    //     admin_nickname: "TKH",
    // },
    admin: {},
    products: [],
    customers: [],
    supplier: [],
    staffs: [],
    appLoading: 1,
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case "INITIAL_APP_DATA":
            return {...state, ...action.payload};
        case "UPDATE_ADMIN":
            return {...state, admin: action.payload};
        case "UPDATE_PRODUCTS":
            return {...state, products: action.payload};
        case "UPDATE_CUSTOMERS":
            return {...state, customers: action.payload};
        case "UPDATE_APPLOADING":
            return {...state, appLoading: action.payload};
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;