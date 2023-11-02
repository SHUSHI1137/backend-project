import { User } from "@prisma/client";
import { ICreateUserDto } from "../dto/user";

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
}
