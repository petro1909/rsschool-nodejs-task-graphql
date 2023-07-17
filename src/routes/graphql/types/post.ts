import { User } from "./user.js";


export type PostInput = {
  id: string;
  dto: any;
  authorId: string;
}

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
}