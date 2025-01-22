import { connectToDatabase } from "@/utils/db";
import { ObjectId } from "mongodb";
import { User } from "../../../models/user";

/**
 * Creates a new blog blog in the database.
 * @param {string} title The title of the blog.
 * @param {string} content The content of the blog.
 * @param {User} author The author of the blog.
 * @returns {Promise<DocumentInsertionResult>} The ID of the newly created blog.
 */
export async function createBlogService(
  title: string,
  content: string,
  author: User
) {
  const db = await connectToDatabase();
  const blogCollection = db.collection("blogs");

  return blogCollection.insertOne({
    title,
    content,
    author: author,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

export async function getBlogsService(page = 1, limit = 12) {
  const db = await connectToDatabase();
  const blogCollection = db.collection("blogs");

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  // Fetch blogs with pagination
  const blogs = await blogCollection.find({}).skip(skip).limit(limit).toArray();

  return blogs;
}

export async function getBlogByIdService(id: string) {
  const db = await connectToDatabase();
  const blogCollection = db.collection("blogs");

  return blogCollection.findOne({ _id: new ObjectId(id) });
}

/**
 * Retrieves all blog blogs authored by the specified authorId.
 * @param {string} authorId - The ID of the author whose blogs are to be retrieved.
 * @returns {Promise<Blog[]>} A promise that resolves to an array of blogs authored by the given authorId.
 */

export async function getBlogsByAuthorIdService(
  authorId: string,
  page = 1,
  limit = 12
) {
  const db = await connectToDatabase();
  const blogCollection = db.collection("blogs");
  const skip = (page - 1) * limit;

  // Query the blogs collection for documents with the given authorId
  const blogs = await blogCollection
    .find({ "author._id": authorId })
    .skip(skip)
    .limit(limit)
    .toArray();
  return blogs;
}

/**
 * Updates an existing blog blog with the specified id.
 * @param {string} id The ObjectId of the blog blog to be updated.
 * @param {string} title The new title of the blog blog.
 * @param {string} content The new content of the blog blog.
 * @returns {Promise<Blog>} The result of the update operation.
 */
export async function updateBlogService(
  id: string,
  title: string,
  content: string,
) {
  const db = await connectToDatabase();
  const blogCollection = db.collection("blogs");

  return blogCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title,
        content,
        updated_at: new Date(),
      },
    }
  );
}
