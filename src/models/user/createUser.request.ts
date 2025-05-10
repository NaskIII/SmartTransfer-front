import { ProfileType } from "./profile.response";

export default interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  sourceAccount: string;
  password: string;
  confirmPassword: string;
  profile: ProfileType;
}
