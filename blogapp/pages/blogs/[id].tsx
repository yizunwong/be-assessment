import Layout from '@/components/layout';
import { useRouter } from 'next/router';

/**
 * Page component for displaying a single blog post, given the post ID in the router query.
 * If the required data is not available, displays a "Loading post details..." message.
 *
 * @returns {JSX.Element} The post details page component.
 */
const PostDetails = () => {
  const router = useRouter();
  const { id, title, content } = router.query;

  // Handle loading or missing data cases
  if (!id || !title || !content) {
    return (
      <Layout>
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-gray-500">Loading post details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={title as string}>
      <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-600">{title}</h2>
        <p className="text-gray-600 mt-4">{content}</p>
      </div>
    </Layout>
  );
};

export default PostDetails;
