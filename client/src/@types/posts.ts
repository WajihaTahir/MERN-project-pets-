import { User } from "./users";

export interface Comment {
  commentor: User | null;
  comment: string;
  time: Date;
  _id: string;
}

export interface Post {
  _id: string;
  userName: string;
  userPicture?: string;
  caption: string;
  image: string;
  comments?: Comment[];
  likes?: string;
  ownedbyuser?: User;
  time: Date;
}
