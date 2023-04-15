import { BaseApiResponse } from "../../common/model/BaseApiResponse";
import { SignInRequest, SignUpRequest, SignUpResponse, User } from "../../redux/user/user.model";
import api from "../../utils/interceptors";

export class UserService {
     static async signIn (param: SignInRequest): Promise<BaseApiResponse<User>>{
        return (await api.post('Users/signin', param))?.data
    }
    static async testToken(): Promise<BaseApiResponse<any>> {
        return (await api.post('Users/TestToken'))?.data
    }

    static async singUp (param: SignUpRequest) : Promise<BaseApiResponse<SignUpResponse>> {
        return (await api.post('Users/signup', param))?.data
    }
}