import express from "express";
const router = express.Router();

import { isAuthenticated } from "../middleware/auth.js";

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    cssPath: "/public/css/dashboard.css",
    user: req.session.user,
  });
});

export default router;

