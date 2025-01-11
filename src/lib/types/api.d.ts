declare type SuccessfulResponse<T> = {
  message: "success";
  token: string;
  user: T;
};

declare type ValidationError = {
  field: string;
  errorMessage: string;
};

declare type ErrorResponse = {
  message: string 
};

declare type ErrorResponse = {
  // status: "error" | "fail";
  message: string;
  Code: number;
};

declare type APIResponse<T> = SuccessfulResponse<T> | ErrorResponse;


