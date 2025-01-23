import { connectToDatabase } from "@/utils/db";
import { ObjectId } from "mongodb";
import { User } from "../models/user";

/**
 * Creates a new blog blog in the database.
 * @param {string} title The title of the blog.
 * @param {string} content The content of the blog.
 * @param {User} author The author of the blog.
 * @returns {Promise<DocumentInsertionResult>} The ID of the newly created blog.
 */
export async function createBlogService(
  title: string,
  content: any,
  author: { id: string }
) {
  try {
    // Create a new blog document using Payload's API
    const result = await payload.create({
      collection: "blogs",
      data: {
        title,
        content, 
        author: author.id, 
        updated_at: new Date().toISOString(),
      },
    });

    return result; // Return the created document
  } catch (error) {
    console.error("Error creating blog in Payload CMS:", error);
    throw new Error("Failed to create blog");
  }
}


export async function getBlogsService(page = 1, limit = 12) {
  try {
    // Fetch blogs using Payload's find method with pagination
    const result = await payload.find({
      collection: "blogs", // The collection name in Payload CMS
      limit, // Number of blogs per page
      page, // Current page number
    });

    // Return the fetched blogs and additional pagination metadata
    return {
      blogs: result.docs, // The array of blogs
      total: result.totalDocs, // Total number of documents
      totalPages: result.totalPages, // Total number of pages
      currentPage: result.page, // Current page number
    };
  } catch (error) {
    console.error("Error fetching blogs from Payload CMS:", error);
    throw new Error("Failed to fetch blogs");
  }
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
import payload from "payload";

export async function updateBlogService(id: string, title: string, content: string) {
  try {
    // Update the blog using Payload's update method
    const result = await payload.update({
      collection: "blogs",
      id, // The ID of the blog to update
      data: {
        title,
        content,
        updated_at: new Date().toISOString(),
      },
    });

    return result;
  } catch (error) {
    console.error("Error updating blog in Payload CMS:", error);
    throw new Error("Failed to update blog");
  }
}

