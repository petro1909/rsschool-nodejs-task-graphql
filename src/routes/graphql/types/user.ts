
import { Post } from "./post.js";
import { Profile } from "./profile.js";

export type UserInput = {
  id: string;
  dto: any;
  authorId: string;
  userId: string;
}

export type User = {
  id: string;
  name: string;
  balance: number;
  posts: Array<Post>;
  profile?: Profile; 
}
