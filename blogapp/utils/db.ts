import { MongoClient, Db } from "mongodb";

// Global variables to cache the MongoDB client and database connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  // If a cached connection exists, return it
  if (cachedClient && cachedDb) {
    console.log("Using cached MongoDB client and database");
    return cachedDb;
  }

  // Ensure the MongoDB URI and database name are set
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri || !dbName) {
    throw new Error(
      "Please define the MONGODB_URI and MONGODB_DB environment variables."
    );
  }

  // Create a new MongoDB client
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
  });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Successfully connected to MongoDB");

    // Cache the client and database connection
    cachedClient = client;
    cachedDb = client.db(dbName);

    return cachedDb;
  } catch (error) {
    // If the connection fails, reset the cached client and database
    cachedClient = null;
    cachedDb = null;
    console.error("Failed to connect to MongoDB:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}