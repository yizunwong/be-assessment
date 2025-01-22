interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
}