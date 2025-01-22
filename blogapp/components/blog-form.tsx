interface BlogFormProps {
    title: string;
    content: string;
    isSubmitting: boolean;
    onTitleChange: (value: string) => void;
    onContentChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
  }
  
  const BlogForm: React.FC<BlogFormProps> = ({
    title,
    content,
    isSubmitting,
    onTitleChange,
    onContentChange,
    onSubmit,
  }) => {
    return (
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mx-auto">
        <h2 className="text-2xl font-semibold text-blue-600">Create Blog</h2>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-gray-700 font-medium">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md text-black"
              rows={6}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Create Blog"}
          </button>
        </form>
      </div>
    );
  };
  
  export default BlogForm;
  