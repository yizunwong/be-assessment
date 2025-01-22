import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  let { username, email, password } = req.body;
  console.log("server", username, email, password);

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const db = await connectToDatabase();

    // Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use." });
    }

    password = await bcrypt.hash(password, 10);
    // Insert the new user
    const result = await db.collection("users").insertOne({
      username,
      email,
      password,
    });

    return res.status(201).json({ success: true, userId: result.insertedId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
