import { IUserHandler } from ".";
import { IBlacklistRepository, IUserRepository } from "../repositories";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { RequestHandler } from "express";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IErrorDto } from "../dto/error";
import {
  PrismaClientKnownRequestError,
  Public,
} from "@prisma/client/runtime/library";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../const";
import { AuthStatus } from "../middleware/jwt";
import { IMessageDto } from "../dto/message";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;
  private blacklistRepo: IBlacklistRepository;
  constructor(repo: IUserRepository, blacklistRepo: IBlacklistRepository) {
    this.repo = repo;
    this.blacklistRepo = blacklistRepo;
  }

  public findById: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  > = async (req, res) => {
    try {
      const { registeredAt, ...others } = await this.repo.findById(
        res.locals.user.id
      );

      return res
        .status(200)
        .json({ ...others, registeredAt })
        .end();
    } catch (error) {
      console.error(error);

      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public findByUsername: RequestHandler<
    { username: string },
    IUserDto | IErrorDto
  > = async (req, res) => {
    try {
      const { password, registeredAt, ...userInfo } =
        await this.repo.findByUsername(req.params.username);

      return res
        .status(200)
        .json({ ...userInfo, registeredAt: registeredAt })
        .end();
    } catch (error) {
      console.error(error);

      return res.status(404).send({ message: "User not found" });
    }
  };

  public login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto> =
    async (req, res) => {
      const { username, password: plainPassword } = req.body;
      try {
        const { password, id } = await this.repo.findByUsername(username);

        // if (!username) throw new Error("Username is wrong");

        if (!verifyPassword(plainPassword, password))
          throw new Error("Username or Password is wrong");

        const accessToken = sign({ id }, JWT_SECRET, {
          algorithm: "HS512",
          expiresIn: "12h",
          issuer: "learnhub-api",
          subject: "user-credential",
        });
        return res.status(200).json({ accessToken }).end();
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
    };

  public registration: RequestHandler<
    {},
    IUserDto | IErrorDto,
    ICreateUserDto
  > = async (req, res) => {
    const { name, username, password: plainPassword } = req.body;

    if (typeof name !== "string" || name.length === 0)
      return res.status(400).json({ message: "name is invalid" });
    if (typeof username !== "string" || username.length === 0)
      return res.status(400).json({ message: "username is invalid" });
    if (typeof plainPassword !== "string" || plainPassword.length < 5)
      return res.status(400).json({ message: "password is invalid" });

    try {
      const {
        id: registeredId,
        name: registeredName,
        username: registeredUsername,
        registeredAt,
      } = await this.repo.create({
        name,
        username,
        password: hashPassword(plainPassword),
      });

      return res
        .status(201)
        .json({
          id: registeredId,
          name: registeredName,
          username: registeredUsername,
          registeredAt: registeredAt,
        })
        .end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(401).json({
          message: `Name is invalid`,
        });
      }
      return res.status(500).json({
        message: `Internal Server Error`,
      });
    }
  };

  public logout: RequestHandler<
    {},
    IMessageDto,
    undefined,
    undefined,
    AuthStatus
  > = async (req, res) => {
    const authHeader = req.header("Authorization");
    if (!authHeader)
      return res
        .status(400)
        .send({ message: "Authorization is expected" })
        .end();

    const token = authHeader.replace("Bearer ", "").trim();

    const decoded = verify(token, JWT_SECRET) as JwtPayload;

    const exp = decoded.exp;

    if (!exp)
      return res.status(400).send({ message: "expire is missing" }).end();

    this.blacklistRepo.addToBlacklist(token, exp);
  };
}
