import { User } from "./user";

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: User;
  created_at: string; // Use `Date` if you plan to parse this string into a Date object
  updated_at: string; // Use `Date` if you plan to parse this string into a Date object
}
