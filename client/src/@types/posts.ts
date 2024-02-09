interface Comment {
  commentorId: string;
  commentorName: string;
  commentorPicture: string;
  comment: string;
}

export interface Post {
  _id: string;
  userName:string;
  userPicture?:string;
  caption: string;
  image: string;
  comments?: Comment[];
  likes?: string;
}
