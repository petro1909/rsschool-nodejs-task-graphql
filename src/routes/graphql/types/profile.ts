import { MemberType } from "./memberType.js";
import { User } from "./user.js";

export type ProfileInput = {
  id: string;
  dto: any;
  userId: string;
}

export type Profile = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  user: User;
  memberTypeId: string;
  memberType: MemberType;
}