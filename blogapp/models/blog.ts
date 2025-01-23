interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
}

interface BlogContent {
  root: {
    type: string;
    children: {
      type: string;
      version: number;
      [key: string]: unknown;
    }[];
    direction: "ltr" | "rtl" | null;
    format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
    indent: number;
    version: number;
  };
  [key: string]: unknown;
}
