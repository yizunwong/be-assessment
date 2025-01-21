import { NextApiRequest, NextApiResponse } from "next";
import {
  createBlogService,
  getBlogsService,
  getBlogByIdService,
  updateBlogService,
  getBlogsByAuthorIdService,
} from "../services/blogService";

export async function createBlog(req: NextApiRequest, res: NextApiResponse) {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ error: "All fields (title, content, author) are required." });
  }

  try {
    const result = await createBlogService(title, content, author);
    return res.status(201).json({ success: true, blogId: result.insertedId });
  } catch (error) {
    console.error("Error in createBlog controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getBlogs(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;

    const blogs = await getBlogsService(page);

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Error in getBlogs controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getBlogById(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const blog = await getBlogByIdService(id);
    if (blog) {
      return res.status(200).json(blog);
    } else {
      return res.status(404).json({ error: "Blog not found." });
    }
  } catch (error) {
    console.error("Error in getBlogById controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getBlogsByAuthorId(req: NextApiRequest, res: NextApiResponse) {
    const { authorId } = req.query;
    try {
      const blogs = await getBlogsByAuthorIdService(authorId as string);
  
      if (blogs && blogs.length > 0) {
        return res.status(200).json(blogs);
      } else {
        return res.status(404).json({ error: "No blogs found for the given author." });
      }
    } catch (error) {
      console.error("Error in getBlogsByAuthorId controller:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

export async function updateBlog(req: NextApiRequest, res: NextApiResponse) {
  const { id, title, content, authorId } = req.body;

  if (!id || !title || !content || !authorId) {
    return res.status(400).json({ error: "All fields (id, title, content, authorId) are required." });
  }

  try {
    const result = await updateBlogService(id, title, content, authorId);
    if (result.matchedCount > 0) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ error: "Blog not found." });
    }
  } catch (error) {
    console.error("Error in updateBlog controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
