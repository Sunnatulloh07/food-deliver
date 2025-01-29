import { Avatar, Role } from '@prisma/client';

export interface UserData {
  id?: string;
  name: string;
  email: string;
  phone_number: number;
  password?: string;
  address?: string;
  role?: Role;
  avatar?: Avatar;
}

export interface OAuthUserData {
  provider: string;
  social_id: string;
  email?: string;
  name?: string;
  picture?: string;
}
