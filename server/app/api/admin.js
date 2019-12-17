const express = require("express");
const router = express.Router();

// get all products
router.get('/admin', async (req, res) => {
    res.json({route: "get admin"})
});

router.post('/admin', async (req, res) => {
    res.json({route: "post admin"})
});

router.put('/admin', async (req, res) => {
    res.json({route: "put admin"})
});

router.delete('/admin', async (req, res) => {
    res.json({route: "delete admin"})
});

module.exports = router;