import BlogList from "@/components/blog-list";
import Layout from "@/components/layout";
import { Blog } from "@/payload-types";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface HomeProps {
  initialBlogs: Blog[];
  initialPage: number; // Pass the initial page number from the server
}

const Home: React.FC<HomeProps> = ({ initialBlogs, initialPage }) => {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(initialPage + 1); // Start from the next page
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreBlogs = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/blogs?page=${initialPage}&populate=author`
      );
      const data = await response.json();

      if (data.docs.length === 0) {
        setHasMore(false); // No more blogs to fetch
      } else {
        setBlogs((prevBlogs) => {
          const existingIds = new Set(prevBlogs.map((blog) => blog.id)); // Track existing blog IDs
          const newBlogs = data.docs.filter(
            (blog: any) => !existingIds.has(blog.id)
          ); // Filter out duplicates
          return [...prevBlogs, ...newBlogs];
        });
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching more blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Popular Blogs">
      <InfiniteScroll
        dataLength={blogs.length}
        next={fetchMoreBlogs}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center my-4">
            <CircularProgress color="primary" /> {/* Circular spinner */}
          </div>
        }
        endMessage={
          <p className="text-center text-gray-500 my-4">
            No more blogs to load.
          </p>
        }
      >
        <BlogList blogs={blogs} />
      </InfiniteScroll>
    </Layout>
  );
};

export default Home;

export async function getServerSideProps(context: {
  req: { cookies: { token: any } };
}) {
  try {
    const initialPage = 1;

    const response = await fetch(
      `http://localhost:3000/api/blogs?page=${initialPage}&populate=author`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const data = await response.json();

    const initialBlogs = data.docs.map((blog: any) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author: blog.author, // Populated author object
    }));

    console.log("API Response:", data);
    console.log("Initial Blogs:", initialBlogs);

    return {
      props: { initialBlogs, initialPage },
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      props: { initialBlogs: [], initialPage: 1 },
    };
  }
}
