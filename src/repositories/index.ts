import { User } from "@prisma/client";
import { ICreateUserDto } from "../dto/user";

export interface IUserExtended
  extends Pick<User, "id" | "name" | "username" | "registeredAt"> {}

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUserExtended>;
}
