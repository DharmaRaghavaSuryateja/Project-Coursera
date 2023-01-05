var express = require("express");
var app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve("src", './config/.env') });
var multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });
app.use(upload.array());
app.use(express.static("public"));
var cors = require("cors");
app.use(cors());
const port = process.env.PORT;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
var userRoute = require("./routes/userRoute.ts");
app.use("/", userRoute);
var teacherRoute = require("./routes/teacherRoute");
app.use("/", teacherRoute);
var studentRoute = require("./routes/studentRoute.ts");
app.use("/", studentRoute);
app.listen(port,()=>{
console.log(`Running on Port ${port}`)
});
