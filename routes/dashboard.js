import express from "express";
const router = express.Router();
import { dbConnection } from '../config/mongoConnection.js';

router.get("/dashboard", (req, res) => {
    // try {
    //   const userId = req.session.user.id;

    //   return res.status(200).render("dashboard", {
    //     title: "Dashboard",
    //     cssPath: `/public/css/customer-dashboard.css`,
    //     user: req.session.user,
    //   });
    // } catch (error) {
    //   return res.status(500).json(error);
    // }
    res.render("dashboard",{
      title:"Dashboard",
      cssPath:`/public/css/dashboard.css`,
      // user: req.session.user,
    });
  }
);

export default router;

