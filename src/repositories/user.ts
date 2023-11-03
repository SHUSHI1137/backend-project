import { PrismaClient, User, Content } from "@prisma/client";
import { IUserExtended, IUserRepository } from ".";
import { ICreateUserDto } from "../dto/user";
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

  public async findByUsername(username: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
  }

  public async findById(id: string): Promise<IUserExtended> {
    return await this.prisma.user.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
        username: true,
        registeredAt: true,
      },
      where: { id },
    });
  }
}
