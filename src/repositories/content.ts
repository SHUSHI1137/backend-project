import { PrismaClient } from "@prisma/client";
import { ICreateContentDto, IUpdateContentDto } from "../dto/content";
import { IContent, IContentRepository } from ".";

export default class ContentRepository implements IContentRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  public getAll(): Promise<IContent[]> {
    return this.prisma.content.findMany({
      include: {
        User: {},
      },
    });
  }

  public async getById(id: number): Promise<IContent> {
    const result = await this.prisma.content.findUniqueOrThrow({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
          },
        },
      },
    });
    return result;
  }

  public async create(
    ownerId: string,
    content: ICreateContentDto
  ): Promise<IContent> {
    return await this.prisma.content.create({
      data: {
        ...content,
        User: {
          connect: { id: ownerId },
        },
      },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
          },
        },
      },
    });
  }
  public async update(
    id: number,
    content: IUpdateContentDto
  ): Promise<IContent> {
    return await this.prisma.content.update({
      where: { id },
      data: content,
      include: {
        User: {},
      },
    });
  }

  public async delete(id: number): Promise<IContent> {
    return await this.prisma.content.delete({
      where: { id },
      include: {
        User: {},
      },
    });
  }
}
