import express from "express";
const router = express.Router();
import { dbConnection } from '../config/mongoConnection.js';


router.get("/signup", (req, res) => {
  res.render("signup"); // You’ll create signup.handlebars
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Validate input here
  // Store user in DB (e.g., hashed password)

  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login"); // You’ll create login.handlebars
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate credentials here
  // If successful, set session or cookie

  res.redirect("/");
});

export default router;
