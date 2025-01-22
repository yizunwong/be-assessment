import BlogList from "@/components/blog-list";
import Layout from "@/components/layout";
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
        `http://localhost:3000/api/blogs?page=${page}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false); // No more blogs to fetch
      } else {
        setBlogs((prevBlogs) => [...prevBlogs, ...data]);
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

export async function getServerSideProps() {
  try {
    // Fetch the first page of data
    const initialPage = 1; // Start with page 1
    const response = await fetch(
      `http://localhost:3000/api/blogs?page=${initialPage}`
    );
    const data = await response.json();

    const initialBlogs = data.map((blog: any) => ({
      id: blog._id,
      title: blog.title,
      content: blog.content,
      author: blog.author,
    }));

    return {
      props: { initialBlogs, initialPage }, // Pass the initial page number
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      props: { initialBlogs: [], initialPage: 1 }, // Handle errors gracefully
    };
  }
}