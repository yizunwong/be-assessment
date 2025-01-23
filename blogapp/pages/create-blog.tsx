import BlogForm from "@/components/blog-form";
import Layout from "@/components/layout";
import { User } from "@/models/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const CreateBlog = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = session?.user as User;

  if (status === "loading") {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with your API endpoint for creating a blog
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, author: user!._id }),
      });

      if (response.ok) {
        router.push("/my-blogs");
      } else {
        console.error("Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Create Blog">
      <BlogForm
        title={title}
        content={content}
        isSubmitting={isSubmitting}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default CreateBlog;
