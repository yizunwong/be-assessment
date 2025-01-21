import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    console.log("Using cached MongoDB client and database");
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI || "your-mongo-uri";
  const dbName = process.env.MONGODB_DB || "default-db"; 

  const client = new MongoClient(uri);

  if (!cachedClient) {
    cachedClient = await client.connect();
  }

  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}
