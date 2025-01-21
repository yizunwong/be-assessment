import { NextApiRequest, NextApiResponse } from "next";
import { createBlog, getBlogs, getBlogsByAuthorId, updateBlog } from "../controllers/blogController";

/**
 * API handler for managing blog-related requests.
 *
 * Supports the following HTTP methods:
 * - POST: Creates a new blog post via the createBlog controller.
 * - GET: Retrieves all blog posts or those by a specific author if an authorId is provided.
 * - PUT: Updates an existing blog post via the updateBlog controller.
 *
 * Responds with appropriate status codes and JSON messages for each action.
 * Handles errors and returns a 500 status code for any internal server errors.
 *
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The outgoing response object.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "POST":
        return await createBlog(req, res);
      case "GET":
        const { authorId } = req.query;
        if (authorId) {
          
          return await getBlogsByAuthorId(req, res);
        } else {
          return await getBlogs(req, res);
        }
      case "PUT":
        return await updateBlog(req, res);
      default:
        res.setHeader("Allow", ["POST", "GET", "PUT"]);
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
