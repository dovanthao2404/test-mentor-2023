interface UserCommon {
  email: string;
  phoneNumber: string;
  name: string;
}
export interface User extends UserCommon {
  id: number;
  avatar?: string;
  accessToken: string;
}
export interface SignInRequest {
  email: string;
  passWord: string;
}

export interface SignUpRequest extends UserCommon {
  passWord: string;
}

export interface UserByKeywordResponse extends UserCommon {
  userId: number;
  avatar: string;
}

export type SignUpResponse = SignUpRequest;
