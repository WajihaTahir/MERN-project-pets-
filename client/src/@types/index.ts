export declare type ResNotOk = {
  error: string;
};

export declare type UploadFileResponse = {
  message: string;
  error: boolean;
  data: {
    imageUrl: string;
    public_id: string;
  };
};
