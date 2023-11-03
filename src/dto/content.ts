import { Content } from "@prisma/client";
import { IUserDto } from "./user";

export interface IContentDto {
  id: number;
  videoTitle: string;
  videoUrl: string;
  comment: string;
  rating: number;
  thumbnaiUrl: string;
  creatorName: string;
  creatorUrl: string;
  postedBy: IUserDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateContentDto
  extends Pick<
    IContentDto,
    | "videoUrl"
    | "comment"
    | "rating"
    | "creatorName"
    | "creatorUrl"
    | "thumbnaiUrl"
    | "videoTitle"
  > {}

export interface IUpdateContentDto
  extends Pick<Content, "comment" | "rating"> {}
