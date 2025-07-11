import { dbConnection } from '../config/mongoConnection.js';
import bcrypt from 'bcrypt';

export const createUser = async (username, email, password) => {
  if (!username || !email || !password) throw "All fields are required";

  const db = await dbConnection();
  const users = db.collection('users');

  const existingUsername = await users.findOne({ username });
  const existingEmail = await users.findOne({ email });

  if (existingUsername) throw "Username already taken";
  if (existingEmail) throw "Email already registered";

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username,
    email,
    hashedPassword
  };

  const result = await users.insertOne(newUser);
  if (!result.insertedId) throw "Could not create user";

  return { userCreated: true };
};

export const checkUser = async (email, password) => {

  if (!email || !password) throw "Email and password are required";

  const db = await dbConnection();
  const users = db.collection('users');

  const user = await users.findOne({ email });
  if (!user) throw "Invalid email or password";

  const match = await bcrypt.compare(password, user.hashedPassword);
  if (!match) throw "Invalid email or password";

  return { authenticated: true, user };
};
