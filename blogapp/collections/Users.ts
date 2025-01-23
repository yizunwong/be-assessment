import { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users", 
  auth: true, 
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "username",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
  ],
};
