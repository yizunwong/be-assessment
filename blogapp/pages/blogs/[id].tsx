import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // Import the cookies library

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
}

const BlogDetails = () => {
  const router = useRouter();
  const { id } = router.query as { id: string }; // Blog ID from the query
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
  } | null>(null);

  const token = Cookies.get("payload-token");

  console.log(token);

  useEffect(() => {
    if (!token) return; 

    fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch current user");
        return res.json();
      })
      .then((data) => {
        console.log(data.user);
        setCurrentUser(data.user);
      })
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    if (id) {
      fetch(`/api/blogs/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch blog details");
          return res.json();
        })
        .then((data: Blog) => {
          setBlog(data);
          setEditedTitle(data.title);
          setEditedContent(data.content);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!blog) {
    return (
      <Layout>
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-gray-500">Loading blog details...</p>
        </div>
      </Layout>
    );
  }

  const handleSubmit = () => {
    fetch(`/api/blogs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
      body: JSON.stringify({
        title: editedTitle,
        content: editedContent,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update blog details");
        return res.json();
      })
      .then((updatedBlog) => {
        // Ensure the updated blog includes the populated author
        setBlog((prevBlog) => ({
          ...updatedBlog,
          author: prevBlog?.author || blog.author, 
        }));
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
  };
  

  const isAuthor = currentUser && blog.author.id === currentUser.id;

  return (
    <Layout title={editedTitle}>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-96 rounded-t-lg overflow-hidden shadow-lg"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-4xl font-bold text-white mb-4 bg-transparent border-b-2 border-white outline-none"
              />
            ) : (
              <h1 className="text-4xl font-bold text-white mb-4">
                {editedTitle}
              </h1>
            )}
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-800">
                  {blog.author?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-200">
                By {blog.author?.username}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full mx-auto bg-white p-8 rounded-b-lg shadow-lg">
        <div className="prose max-w-none text-gray-700">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-64 p-2 border-2 border-gray-300 rounded-lg outline-none"
            />
          ) : (
            <p>{blog.content}</p>
          )}
        </div>

        {/* Edit and Submit Buttons */}
        <div className="mt-8 flex justify-between">
          <Link
            href="/"
            className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
          >
            ← Back to Blogs
          </Link>
          {isAuthor && 
            (isEditing ? (
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Edit
              </button>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetails;
