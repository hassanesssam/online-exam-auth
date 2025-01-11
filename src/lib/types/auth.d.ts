declare type User = {
    _id: string,
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
  }
  
  declare type LoginResponse = {
    token: string;
    user: User;
  };
  
 declare interface FormValues {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
  }
  
  declare interface ApiErrorResponsee {
    message: string;
    code?: string;  
    details?: string; 
    status?: number; 
  }