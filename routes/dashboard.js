import express from "express";
const router = express.Router();
import { dbConnection } from '../config/mongoConnection.js';

router.get("/dashboard", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const db = await dbConnection();
    const urlsCollection = db.collection("urls");

    const userLinks = await urlsCollection.find({
      userId: req.session.user.id
    }).toArray();

    const links = userLinks.map(link => ({
      original: link.longUrl,
      short: `http://localhost:3000/${link.shortCode}`,
      clicks: link.clicks.length,
      id: link._id.toString()
    }));

    return res.render("dashboard", {
      title: "Dashboard",
      cssPath: `/public/css/dashboard.css`,
      user: req.session.user,
      links
    });

  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;

