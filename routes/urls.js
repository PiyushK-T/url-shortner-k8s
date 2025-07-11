import express from "express";
import { dbConnection } from "../config/mongoConnection.js";
import { nanoid } from "nanoid";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET Home Page
router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  res.render("home", {
    title: "URL Shortener",
    cssPath: "/public/css/main.css",
    user: req.session.user || null,
  });
});

// POST Shorten URL
router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl || typeof longUrl !== "string" || !longUrl.trim()) {
    if (req.session.user) {
      return res.status(400).json({ error: "longUrl cannot be empty." });
    } else {
      return res.status(400).render("home", {
        title: "URL Shortener",
        cssPath: "/public/css/main.css",
        error: "Please enter a valid URL.",
      });
    }
  }

  try {
    const db = await dbConnection();
    const urlsCollection = db.collection("urls");

    const shortCode = nanoid(6);
    const newUrl = {
      shortCode,
      longUrl: longUrl.trim(),
      creationDate: new Date(),
      clicks: [],
      userId: req.session.user?.id || null,
    };

    const result = await urlsCollection.insertOne(newUrl);

    const shortUrl = `http://localhost:3000/${shortCode}`;

    // Logged-in users get JSON 
    if (req.session.user) {
      return res.json({
        shortUrl,
        id: result.insertedId.toString(),
      });
    }

    // result page non-user
    return res.render("result", { shortUrl });
  } catch (e) {
    console.error(e);
    if (req.session.user) {
      return res.status(500).json({ error: "Server error" });
    } else {
      return res.status(500).render("home", {
        title: "URL Shortener",
        cssPath: "/public/css/main.css",
        error: "Something went wrong.",
      });
    }
  }
});

// GET Redirect Short URL
router.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  try {
    const db = await dbConnection();
    const urlsCollection = db.collection("urls");

    const urlDoc = await urlsCollection.findOne({ shortCode });

    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    await urlsCollection.updateOne(
      { shortCode },
      {
        $push: {
          clicks: {
            timestamp: new Date(),
            ip: req.ip,
          },
        },
      }
    );

    res.redirect(urlDoc.longUrl);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE Link by ID
router.delete("/links/:id", async (req, res) => {
  const { id } = req.params;

  if (!req.session.user) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const db = await dbConnection();
    const urlsCollection = db.collection("urls");

    const deletion = await urlsCollection.deleteOne({
      _id: new ObjectId(id),
      userId: req.session.user.id, 
    });

    if (deletion.deletedCount === 0) {
      return res.status(404).json({ error: "Link not found or not authorized" });
    }

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
