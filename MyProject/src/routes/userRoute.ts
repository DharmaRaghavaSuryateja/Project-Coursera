import AppDataSource from "../data-source"
import { User } from "../entity/User"
let bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var express = require("express");
const router = express.Router();
let cookieParser = require("cookie-parser");
router.use(cookieParser());

//Register

router.post("/register", async (req, res) => {
  if(req.body.name!==undefined && req.body.email!==undefined){
  let state = 0;
  let userRepository = AppDataSource.getRepository(User)
  try{
  var data = await userRepository.find();
  }catch(error)
  {
    return res.json({error:"Internal Server Error"})
  }
  for (let i = 0; i < data.length; i++) {
    if (data[i].email === req.body.email) {
      state = 1;
      break;
    }
  }
  if (state == 0) {
    let hashpassword = await bycrypt.hash(req.body.password, 8);
    let user = userRepository.create({
      name: req.body.name,
      email: req.body.email,
      password: hashpassword,
      occupation: req.body.occupation,
    })
    await userRepository.save(user)
    const token = jwt.sign({ id: user.id.toString() }, process.env.JWT_SECRET);
    return res.json({ data: user, token: token })
  }
  else if (state == 1) {
    return res.json({ data: "User already exists!" })
  }
}
else{
  res.json({msg:"evadra nuvvu"})
}
});

//Login

router.post("/login", async (req, res) => {
  let state = 0;
  let userRepository = AppDataSource.getRepository(User)
  try{
  var data = await userRepository.find();
}catch (error) {
  return res.json({ error: "Internal Server Error" })
}
  let id;
  let hashPassword;
  let occupation;
  for (let i = 0; i < data.length; i++) {
    if (data[i].email === req.body.email) {
      id = data[i].id;
      hashPassword = data[i].password;
      occupation = data[i].occupation;
      state = 1;
      break;
    }
  }
  if (state == 1) {
    let result = await bycrypt.compare(req.body.password, hashPassword);
    if (result) {
      const token = jwt.sign({ id: id.toString() }, process.env.JWT_SECRET);
      return res.json({ data: token, occupation: occupation })
    }
    else {
      return res.json({ data: "Invalid Password" })
    }
  }
  else if (state == 0) {
    return res.json({ data: "User doesn't Exists!" })
  }
});

module.exports = router;