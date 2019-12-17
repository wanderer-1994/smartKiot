import axios from "axios";
(() => {
    let admin_key = localStorage.getItem("admin_key");
    if(admin_key) axios.defaults.headers.common['Authorization'] = `{"admin_key": "${admin_key}"}`;
})();
let domain = "http://localhost:9000"

async function getAppInitialState(login, cb){
    let data = new Object;
    try{
        let response = await axios.post(`${domain}/api/app_initial`, login);
        data.admin = response.data.admin || {};
        data.products = response.data.products || [];
        if(response.data.admin_key){
            localStorage.setItem("admin_key", response.data.admin_key);
            axios.defaults.headers.common['Authorization'] = `{"admin_key": "${response.data.admin_key}"}`;
        }
        cb(null, data);
    } catch(err) {
        console.log(err);
        data.admin = {};
        data.products = [];
        cb(err, data);
    }
}

async function addProduct(newProducts, cb){
    try{
        let response = await axios.post(`${domain}/api/product`, {newProducts: newProducts});
        if(cb) cb(response.data.Alert, response.data.products);
    } catch(err) {
        let Alert = ["Lỗi rồi!"];
        if(cb) cb(Alert);
    }
}

async function updateProduct(updatedProducts, cb){
    try{
        let response = await axios.put(`${domain}/api/product`, {updatedProducts: updatedProducts});
        if(cb) cb(response.data.Alert, response.data.products);
    } catch(err) {
        let Alert = ["Lỗi rồi!"];
        if(cb) cb(Alert);
    }
}

async function deleteProduct(prod_id, cb){
    try{
        let response = await axios.delete(`${domain}/api/product?prod_id=${prod_id}`);
        if(cb) cb(response.data.Alert, response.data.products);
    } catch(err) {
        let Alert = ["Lỗi rồi!"];
        if(cb) cb(Alert);
    }
}

export {
    getAppInitialState,
    addProduct,
    updateProduct,
    deleteProduct,
}
