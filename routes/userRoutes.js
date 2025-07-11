import express from "express";
import { createUser, checkUser } from "../data/users.js";

const router = express.Router();

// GET Signup page
router.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Signup",
    cssPath: "/public/css/user.css",
  });
});

// POST Signup
router.post("/signup", async (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  const errors = [];
  if (!username || !email || !password || !confirm_password) {
    errors.push("All fields are required.");
  }
  if (password !== confirm_password) {
    errors.push("Passwords do not match.");
  }

  if (errors.length > 0) {
    return res.status(400).render("signup", {
      title: "Signup",
      cssPath: "/public/css/user.css",
      errors,
    });
  }

  try {
    await createUser(username.trim(), email.trim(), password);
    return res.redirect("/login");
  } catch (e) {
    return res.status(400).render("signup", {
      title: "Signup",
      cssPath: "/public/css/user.css",
      errors: [e],
    });
  }
});

// GET Login page
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    cssPath: "/public/css/user.css",
  });
});

// POST Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log("Login attempt:", { email, password });

  try {
    if (!email || !password) throw "Email and password are required";

    const result = await checkUser(email.trim(), password);
    console.log("checkUser result:", result);
    if (result.authenticated) {
      // req.session.user = { email };
      req.session.user = { 
        id: result.user._id, 
        email: result.user.email,
        username: result.user.username
        };
      return res.redirect("/dashboard");
    } else {
      throw "Invalid email or password";
    }
  } catch (e) {
    res.status(401).render("login", {
      title: "Login",
      cssPath: "/public/css/user.css",
      errors: [e],
    });
  }
});

// GET Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
