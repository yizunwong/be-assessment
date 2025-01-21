import Layout from "@/components/layout";
import PostForm from "@/components/post-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const CreatePost = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect unauthenticated users to the sign-in page
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
      // Replace with your API endpoint for creating a post
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, author: session.user }),
      });

      if (response.ok) {
        router.push("/my-posts");
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Create Post">
      <PostForm
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

export default CreatePost;
