const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { 
    getResGeneralVariables,
    getReqGeneralVariables,
} = require("./server/app/middlewares/middlewares");
const authAPI = require("./server/app/api/auth");
const productAPI = require("./server/app/api/product");
const userAPI = require("./server/app/api/user");
const adminAPI = require("./server/app/api/admin");

//app config - app config - socketio config
const app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(express.static(__dirname + '/server/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Alert, err, check user, check admin
app.use(getReqGeneralVariables, getResGeneralVariables);

app.use("/api", authAPI, productAPI, userAPI, adminAPI);

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
})

app.listen(9000, () => {
    console.log('listening on port 9000');
})