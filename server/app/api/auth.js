const express = require("express");
const msClient = require("../mysql/mysql");
const uuid = require("uuid/v4");
const router = express.Router();
const { 
    checkUserByCookie,
    checkAdminByCookie,
} = require("../middlewares/middlewares");

router.post("/app_initial", checkAdminByCookie, async (req, res) => {
    let data = new Object;
    data.admin = {};
    data.products = [];
    data.Alert = res.Alert;
    try{
        if(req.admin.admin_id){
            data.admin.admin_id = req.admin.admin_id;
            data.admin.admin_nickname = req.admin.admin_nickname;
        }else{
            if(req.body.admin_nickname && req.body.admin_pas){
                let sqlFindAdminByNickname = `SELECT * FROM smartKiot.admin WHERE admin_nickname="${req.body.admin_nickname}" LIMIT 1`;
                let admins = await msClient.promiseQuery(sqlFindAdminByNickname);
                if(!admins[0] || !admins[0].admin_id){
                    data.Alert.push("Tài khoản không tồn tại!");
                }else if(admins[0].admin_pas != req.body.admin_pas){
                    data.Alert.push("Mật khẩu không đúng!");
                }else{
                    data.admin.admin_id = admins[0].admin_id;
                    data.admin.admin_nickname = admins[0].admin_nickname;
                    let admin_key = uuid();
                    let sqlSaveAdminCookie = `UPDATE smartKiot.admin SET admin_cookie="${admin_key}" WHERE admin_id="${admins[0].admin_id}"`
                    await msClient.promiseQuery(sqlSaveAdminCookie);
                    data.admin_key = admin_key;
                }
            }
        }
        if(data.admin.admin_id){
            let sqlFindAllProduct = `SELECT * FROM smartKiot.product`;
            let products = await msClient.promiseQuery(sqlFindAllProduct);
            data.products = products;
        }
        res.json(data);
    } catch (err) {
        console.log(err);
        res.json(data)
    }
})

router.post("/signin", async (req, res) => {
    res.json({route: "signin"})
});

router.post("/login", async (req, res) => {
    res.json({route: "login"})
});

router.get("/logout", async (req, res) => {
    res.json({route: "logout"})
})

module.exports = router;
