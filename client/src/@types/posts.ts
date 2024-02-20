import { User } from "./users";

export interface Comment {
  commentorId: string;
  commentorName: string;
  commentorPicture: string;
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
