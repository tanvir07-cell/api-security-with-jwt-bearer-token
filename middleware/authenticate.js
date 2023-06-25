import jwt from "jsonwebtoken";
import { User } from "../model/user.js";
export async function authenticate(req, res, next) {
  //   console.log(req.headers);
  //   client sends the token in the header:
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  try {
    // client authHeader hishebe dibe: `Bearer token`
    // ekhon eikhan theke Bearer ke split korbo:
    const token = authHeader.split(" ")[1];
    // jwt sign er moddeh jah rekhechi seta pabo decode er moddeh:
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // database theke user er data gula pabo:
    const user = await User.findOne({ _id: decode._id })
      .select("-password")
      .lean()
      .exec();
    req.user = user;
    next();
  } catch (err) {
    console.log(err.message);
    // token jodi expire hoye jay ba vul token dey:
    return res.status(403).json({ message: "Invalid token" });
  }
}
