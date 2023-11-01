import { Prisma, PrismaClient, User } from "@prisma/client";
import { IUserExtended, IUserRepository } from ".";
import { ICreateUserDto, IUserDto } from "../dto/user";

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  public async create(user: ICreateUserDto): Promise<IUserExtended> {
    return await this.prisma.user.create({
      data: user,
      select: {
        id: true,
        name: true,
        username: true,
        registeredAt: true,
      },
    });
  }
}
