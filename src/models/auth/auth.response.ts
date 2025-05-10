import { ProfileType } from "../user/profile.response";

export interface AuthResponse {
    token: string;
    type: string;
    profile: ProfileType;
}

