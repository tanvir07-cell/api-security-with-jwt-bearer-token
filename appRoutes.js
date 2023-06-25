import express from "express";
import { authenticate } from "./middleware/authenticate.js";
import { authorize } from "./middleware/authorization.js";

const router = express.Router();

router.get(
  "/public",
  authenticate,
  authorize(["user", "admin"]),
  (req, res) => {
    return res.status(200).json({ message: "Hello from public route" });
  }
);

router.get("/protected", authenticate, authorize(["admin"]), (req, res) => {
  const { user } = req;
  return res
    .status(200)
    .json({ message: "Hello from protected route", user: user });
});
export default router;
