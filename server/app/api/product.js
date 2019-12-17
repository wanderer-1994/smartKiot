const express = require("express");
const msClient = require("../mysql/mysql");
const router = express.Router();
const { 
    createSystemErrMessage,
    checkUserByCookie,
    checkAdminByCookie,
} = require("../middlewares/middlewares");

// get all products
router.use('/product', checkAdminByCookie);

router.get('/product', async (req, res) => {
    res.json({route: "get product"})
});

router.post('/product', async (req, res) => {
    try{
        if(!req.admin.admin_id) return res.end();
        if(!req.body.newProducts || req.body.newProducts.length < 1) return res.end();
        let insertValues = ``;
        req.body.newProducts.forEach(item => {
            insertValues += `("${item.prod_name}", "${item.count_unit}", "${item.unit_price}", "0"), `
        })
        insertValues = insertValues.replace(/, $/, "");
        let sqlSaveNewProduct = `INSERT INTO smartKiot.product (prod_name, count_unit, unit_price, stock_qty) VALUES ${insertValues};`;
        await msClient.promiseQuery(sqlSaveNewProduct);
        let sqlFindAllProduct = "SELECT * FROM smartKiot.product";
        let products = await msClient.promiseQuery(sqlFindAllProduct);
        res.json({Alert: res.Alert, products: products});
    } catch (err) {
        res.Alert.push(createSystemErrMessage(001));
        res.json({Alert: res.Alert});
    }
});

router.put('/product', async (req, res) => {
    try{
        if(!req.admin.admin_id) return res.end();
        if(!req.body.updatedProducts || req.body.updatedProducts.length < 1) return res.end();
        let insertValues = ``;
        req.body.updatedProducts.forEach(item => {
            insertValues += `("${item.prod_id}", "${item.prod_name}", "${item.count_unit}", "${item.unit_price}"), `
        })
        insertValues = insertValues.replace(/, $/, "");
        let sqlUpdateManyProduct = 
        `INSERT INTO smartKiot.product (prod_id, prod_name, count_unit, unit_price) VALUES ${insertValues}
         ON DUPLICATE KEY UPDATE
         prod_id=VALUES(prod_id),
         prod_name=VALUES(prod_name),
         count_unit=VALUES(count_unit),
         unit_price=VALUES(unit_price);`;
        await msClient.promiseQuery(sqlUpdateManyProduct);
        let sqlFindAllProduct = "SELECT * FROM smartKiot.product";
        let products = await msClient.promiseQuery(sqlFindAllProduct);
        res.json({Alert: res.Alert, products: products});
    } catch (err) {
        res.Alert.push(createSystemErrMessage(001));
        res.json({Alert: res.Alert});
    }
});

router.delete('/product', async (req, res) => {
    try{
        if(!req.admin.admin_id) return res.end();
        if(!req.query.prod_id) return res.end();
        let sqlDeleteProduct = `DELETE FROM smartKiot.product WHERE prod_id="${req.query.prod_id}";`;
        await msClient.promiseQuery(sqlDeleteProduct);
        let sqlFindAllProduct = "SELECT * FROM smartKiot.product";
        let products = await msClient.promiseQuery(sqlFindAllProduct);
        res.json({Alert: res.Alert, products: products});
    } catch (err) {
        res.Alert.push(createSystemErrMessage(001));
        res.json({Alert: res.Alert});
    }
});

module.exports = router;