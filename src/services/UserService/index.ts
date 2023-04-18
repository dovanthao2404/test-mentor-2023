import { BaseApiResponse } from '../../common/model/BaseApiResponse';
import {
  SignInRequest,
  SignUpRequest,
  SignUpResponse,
  User,
  UserByKeywordResponse,
} from '../../redux/user/user.model';
import api from '../../utils/interceptors';

export class UserService {
  static async signIn(param: SignInRequest): Promise<BaseApiResponse<User>> {
    return (await api.post('Users/signin', param))?.data;
  }
  static async testToken(): Promise<BaseApiResponse<string>> {
    return (await api.post('Users/TestToken'))?.data;
  }

  static async singUp(param: SignUpRequest): Promise<BaseApiResponse<SignUpResponse>> {
    return (await api.post('Users/signup', param))?.data;
  }

  static async getUserByKeyword(
    keyword: string,
  ): Promise<BaseApiResponse<UserByKeywordResponse[]>> {
    return (await api.get(`Users/getUser?keyword=${keyword}`))?.data;
  }
}
