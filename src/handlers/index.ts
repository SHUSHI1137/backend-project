import { RequestHandler } from "express";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IErrorDto } from "../dto/error";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { AuthStatus } from "../middleware/jwt";
import {
  IContentDto,
  ICreateContentDto,
  IUpdateContentDto,
} from "../dto/content";
import { IContent } from "../repositories";
import { Content } from "@prisma/client";

export interface Empty {}

export interface ID {
  id: string;
}

export interface IUserHandler {
  registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto>;
  login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto>;
  getPersonalInfo: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  >;
}

export interface IContentHandler {
  getAll: RequestHandler<Empty, IContent[] | IErrorDto>;
  getById: RequestHandler<ID, IContent | IErrorDto>;
  create: RequestHandler<{}, IContentDto | IErrorDto, ICreateContentDto>;
  update: RequestHandler<ID, IContent | string | IErrorDto, IUpdateContentDto>;
  delete: RequestHandler<
    ID,
    IContent | string | IErrorDto,
    undefined,
    undefined,
    AuthStatus
  >;
}
