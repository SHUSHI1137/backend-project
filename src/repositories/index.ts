import { Content, User } from "@prisma/client";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { ICreateContentDto, IUpdateContentDto } from "../dto/content";

// type CreationErrorType = "UNIQUE";

// export class UserCreateionError extends Error {
//   constructor(
//     public readonly type: CreationErrorType,
//     public readonly column: string
//   ) {
//     super();
//   }
// }

export interface IContent extends Content {
  User: IUserDto;
}
export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUserExtended>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<IUserExtended>;
}

export interface IUserExtended
  extends Pick<User, "id" | "name" | "username" | "registeredAt"> {}

export interface IContentRepository {
  getAll(): Promise<IContent[]>;
  getById(id: number): Promise<IContent>;
  create(ownerId: string, content: ICreateContentDto): Promise<IContent>;
  update(id: number, content: IUpdateContentDto): Promise<IContent>;
  delete(id: number): Promise<IContent>;
}

export interface IBlacklistRepository {
  addToBlacklist(token: string, exp: number): Promise<void>;
  isAlreadyBlacklisted(token: string): Promise<boolean>;
}
