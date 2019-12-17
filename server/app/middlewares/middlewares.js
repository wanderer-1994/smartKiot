const msClient = require("../mysql/mysql");
const {
    cookie_patt,
    tel_patt,
    space_patt,
    input_text_patt,
    date_patt
} = require("../const/regex");

const getReqGeneralVariables = (req, res, next) => {
    req.admin = {};
    res.user = {};
    next();
}

const getResGeneralVariables = (req, res, next) => {
    res.Alert = [];
    next();
}

//Kiểm tra user và update expire của cookies nếu tồn tại user. Lưu user vào biến req.user
const checkUserByCookie = async (req, res, next) => {
    console.log("user cookie checked");
    next();
}

//Kiểm tra admin và update expire của cookies nếu tồn tại admin. Lưu admin vào biến req.admin
const checkAdminByCookie = async (req, res, next) => {
    try{
        let admin_key;
        try{
            let auth = JSON.parse(req.headers.authorization);
            admin_key = auth.admin_key;
        }catch(err){
            //do nothing
        }
        if(!admin_key || admin_key == "") return next();
        let sqlFindAdminByCookie = `SELECT * FROM smartKiot.admin WHERE admin_cookie="${admin_key}" LIMIT 1`;
        let admins = await msClient.promiseQuery(sqlFindAdminByCookie);
        if(admins[0] && admins[0].admin_id) req.admin = admins[0];
        next();
    } catch (err) {
        console.log(err);
        next();
    }
}

const createSystemErrMessage = ERRCODE => {
    return `LỖI HỆ THỐNG --- ERRCODE_${ERRCODE}`
}

module.exports = {  
    getReqGeneralVariables,
    getResGeneralVariables,
    checkUserByCookie,
    checkAdminByCookie,
    createSystemErrMessage,
}