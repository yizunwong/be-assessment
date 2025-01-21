import { connectToDatabase } from "@/utils/db";
import { ObjectId } from "mongodb";
import { User } from "../models/user";

/**
 * Creates a new blog post in the database.
 * @param {string} title The title of the post.
 * @param {string} content The content of the post.
 * @param {User} author The author of the post.
 * @returns {Promise<DocumentInsertionResult>} The ID of the newly created post.
 */
export async function createBlogService(title: string, content: string, author: User) {
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
  const blogs = await blogCollection
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray();

  return blogs;
}



export async function getBlogByIdService(id: string) {
  const db = await connectToDatabase();
  const blogCollection = db.collection("blogs");

  return blogCollection.findOne({ _id: new ObjectId(id) });
}

/**
 * Retrieves all blog posts authored by the specified authorId.
 * @param {string} authorId - The ID of the author whose blogs are to be retrieved.
 * @returns {Promise<Blog[]>} A promise that resolves to an array of blogs authored by the given authorId.
 */

export async function getBlogsByAuthorIdService(authorId: string) {
    const db = await connectToDatabase();
    const blogCollection = db.collection("blogs");
  
    // Query the blogs collection for documents with the given authorId
    return blogCollection.find({ "author._id": authorId }).toArray();
  }

/**
 * Updates an existing blog post with the specified id.
 * @param {string} id The ObjectId of the blog post to be updated.
 * @param {string} title The new title of the blog post.
 * @param {string} content The new content of the blog post.
 * @param {string} authorId The user ID of the author making the update.
 * @returns {Promise<Blog>} The result of the update operation.
 */
export async function updateBlogService(id: string, title: string, content: string, authorId: string) {
  const db = await connectToDatabase();
  const blogCollection = db.collection("blogs");

  return blogCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title,
        content,
        author: { user_id: authorId },
        updated_at: new Date(),
      },
    }
  );
}
