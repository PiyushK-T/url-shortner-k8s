import { dbConnection } from "./mongoConnection.js";

const collections = {};

export const getCollection = async (collectionName) => {
  if (!collections[collectionName]) {
    const db = await dbConnection();
    collections[collectionName] = db.collection(collectionName);
  }
  return collections[collectionName];
};

const urlCollection = await getCollection("urls");
const userCollection = await getCollection("users");

export { urlCollection, userCollection };