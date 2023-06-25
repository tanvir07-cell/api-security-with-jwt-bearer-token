import express from "express";
import { connectDB } from "./connection.js";
import { User } from "./model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    await connectDB();
    const { userName, email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // before save a new user to database, we need to hash the password:
    // genSalt(10) means 10 rounds of hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      userName,
      email,
      password: hash,
      role,
    });
    return res.status(201).json({ user: newUser.toJSON() });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // compare the password from the request body with the password from the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credential" });
    }

    // if password  and email are correct, we can generate a token
    const token = jwt.sign(
      {
        // payload:mane e user er data gula thakbe
        _id: user._id,
        userName: user.userName,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );
    return res.status(200).json({ user, token });
  } catch (err) {
    console.log(err);
  }
});

export default router;
