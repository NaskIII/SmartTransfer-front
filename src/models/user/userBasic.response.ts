export interface UserBasicResponse {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profile: 'ADMINISTRATOR' | 'COMMON';
    status: 'ACTIVE' | 'INACTIVE';
}
