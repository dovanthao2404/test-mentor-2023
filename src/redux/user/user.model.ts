export interface User {
    id: string;
    email: string;
    phoneNumber: string;
    name: string;
    accessToken: string;
}
export interface SignInRequest {
    email: string;
    passWord: string;
}

export interface SignUpRequest {
    email: string;
    passWord: string;
    name: string;
    phoneNumber: string;
}

export type SignUpResponse = SignUpRequest