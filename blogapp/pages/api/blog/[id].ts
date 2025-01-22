import { getBlogById, updateBlog } from "@/pages/api/controllers/blogController";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const idString = id as string;
    
  try {
    switch (req.method) {
      case "GET":
        return await getBlogById(req, res, idString);
      case "PUT":
        return await updateBlog(req, res, idString);
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
