export declare interface User {
  _id: string;
  email: string;
  password: string;
  username: string;
  userpicture?: string;
  public_id?: string;
  createdAt: string;
}

export declare type LoginDataType = {
  user: User;
  token: string;
};

export declare type LoginResponse = {
  message: string;
  error: boolean;
  data: LoginDataType;
};
