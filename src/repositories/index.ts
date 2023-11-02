import { User } from "@prisma/client";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { RequestHandler } from "express";
import { IErrorDto } from "../dto/error";

export interface IUserExtended
  extends Pick<User, "id" | "name" | "username" | "registeredAt"> {}

// type CreationErrorType = "UNIQUE";

// export class UserCreateionError extends Error {
//   constructor(
//     public readonly type: CreationErrorType,
//     public readonly column: string
//   ) {
//     super();
//   }
// }

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUserExtended>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<IUserExtended>;
}
