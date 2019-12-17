const express = require("express");
const router = express.Router();

// get all products
router.get('/user', async (req, res) => {
    res.json({route: "get user"})
});

router.post('/user', async (req, res) => {
    res.json({route: "post user"})
});

router.put('/user', async (req, res) => {
    res.json({route: "put user"})
});

router.delete('/user', async (req, res) => {
    res.json({route: "delete user"})
});

module.exports = router;