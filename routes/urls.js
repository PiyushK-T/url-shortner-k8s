import express from "express";
import { dbConnection } from '../config/mongoConnection.js';
import { nanoid } from 'nanoid';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home',{
        title:"Home",
      cssPath:`/public/css/main.css`,
  });
});

router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: "longUrl cannot be empty." });
    }

    try {
        const db = await dbConnection();
        const urlsCollection = db.collection('urls');

        const shortCode = nanoid(6);

        const newUrl = {
            shortCode,
            longUrl,
            creationDate: new Date(),
            clicks: []
        };

        await urlsCollection.insertOne(newUrl);

        res.render('result', { shortUrl: `http://localhost:3000/${shortCode}` });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    try {
        const db = await dbConnection();
        const urlsCollection = db.collection('urls');

        const urlDoc = await urlsCollection.findOne({ shortCode });

        if (!urlDoc) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        await urlsCollection.updateOne(
            { shortCode },
            { $push: { clicks: { timestamp: new Date(), ip: req.ip } } }
        );

        res.redirect(urlDoc.longUrl);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
