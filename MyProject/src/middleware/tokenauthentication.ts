import AppDataSource from "../data-source"
import { User } from "../entity/User"
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
export const authentication = async (req, res, next) => {
   let header = req.headers["authorization"]
   let token = header && header.split(" ")[1];
   //if improper token sent in header ,then it will throw an error.So handling error.
   try {
      var value = jwt.verify(token, process.env.JWT_SECRET);
   }
   catch (error) {

      return res.json({ message: "Authentication Failed" })
   }
   let userRepository = AppDataSource.getRepository(User)
   let data = await userRepository.findBy({
      id: value.id
   })
   let user = data[0]
   req.user = user
   console.log(req.user)
   next();
}


