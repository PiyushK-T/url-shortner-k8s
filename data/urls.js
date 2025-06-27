import { dbConnection } from '../config/mongoConnection.js';

export async function createShortUrl(shortCode, longUrl) {
  const db = await dbConnection();
  const urls = db.collection('urls');
  return urls.insertOne({ shortCode, longUrl, createdAt: new Date(), clicks: [] });
}

export async function getLongUrl(shortCode) {
  const db = await dbConnection();
  const urls = db.collection('urls');
  return urls.findOne({ shortCode });
}

export async function logClick(shortCode, ip) {
  const db = await dbConnection();
  const urls = db.collection('urls');
  return urls.updateOne(
    { shortCode },
    { $push: { clicks: { timestamp: new Date(), ip } } }
  );
}
