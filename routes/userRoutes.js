import express from "express";
const router = express.Router();
import { dbConnection } from '../config/mongoConnection.js';


router.get("/signup", (req, res) => {
  res.render("signup",{
      title:"Signup",
      cssPath:`/public/css/user.css`,
      // user: req.session.user,
  }); 
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Validate input here
  // Store user in DB

  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login",{
      title:"Login ",
      cssPath:`/public/css/user.css`,
      // user: req.session.user,
  }); 
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate credentials here
  // If successful, set session or cookie

  res.redirect("/");
});

export default router;
