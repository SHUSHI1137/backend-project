import { RequestHandler } from "express";
import { IContent, IContentRepository } from "../repositories";
import {
  IContentDto,
  ICreateContentDto,
  IUpdateContentDto,
} from "../dto/content";
import { IErrorDto } from "../dto/error";
import { Empty, IContentHandler, ID } from ".";
import { oembedInfo } from "../utils/noembed";
import { AuthStatus } from "../middleware/jwt";
export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }

  public getAll: RequestHandler<Empty, IContent[] | IErrorDto> = async (
    req,
    res
  ) => {
    try {
      const result = await this.repo.getAll();

      return res.status(200).json(result).end();
    } catch (error) {
      console.error(error);
      if (error instanceof URIError)
        return res.status(400).json({ message: `${error}` });

      res.status(500).json({ message: "Internal Server Error" }).end();
    }
  };

  public getById: RequestHandler<ID, IContent | IErrorDto> = async (
    req,
    res
  ) => {
    try {
      const result = await this.repo.getById(Number(req.params.id));

      if (result !== result)
        return res.status(404).json({ message: "Content not found" });

      return res.status(200).json(result).end();
    } catch (error) {
      console.error(error);
      if (error instanceof URIError)
        return res.status(400).json({ message: `${error}` });

      res.status(404).json({ message: "Content not found" }).end();
    }
  };

  public create: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto
  > = async (req, res) => {
    const { videoUrl, comment, rating } = req.body;

    if (typeof videoUrl !== "string" || videoUrl.length === 0)
      return res.status(400).json({ message: "Url is invalid" });
    if (typeof comment !== "string" || comment.length === 0)
      return res.status(400).json({ message: "Comment is invalid" });
    if (typeof rating !== "number" || rating > 5 || rating < 0)
      return res.status(400).json({ message: "Rating is between range 0-5" });

    const { videoTitle, thumbnaiUrl, creatorName, creatorUrl } =
      await oembedInfo(videoUrl);

    const createContentdata = {
      videoUrl,
      comment,
      rating,
      creatorName: creatorName,
      creatorUrl: creatorUrl,
      thumbnaiUrl: thumbnaiUrl,
      videoTitle: videoTitle,
    };
    console.log(createContentdata);

    try {
      const result = await this.repo.create(
        res.locals.user.id,
        createContentdata
      );

      console.log(oembedInfo);
      console.log(result);

      const returnContent: IContentDto = {
        id: result.id,
        videoTitle: result.videoTitle,
        videoUrl: result.videoUrl,
        comment: result.comment,
        rating: result.rating,
        thumbnaiUrl: result.thumbnaiUrl,
        creatorName: result.creatorName,
        creatorUrl: result.creatorUrl,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        postedBy: result.User,
      };

      console.log(returnContent);

      return res.status(201).json(returnContent).end();
    } catch (error) {
      console.error(error);
      if (error instanceof URIError)
        return res.status(400).json({ message: `${error}` });

      res.status(500).json({ message: "Internal Server Error" }).end();
    }
  };

  public update: RequestHandler<
    ID,
    IContent | string | IErrorDto,
    IUpdateContentDto
  > = async (req, res) => {
    try {
      const { comment, rating } = req.body;

      if (typeof comment !== "string")
        return res.status(400).json({ message: "Comment is Wrong" });
      if (typeof rating !== "number" || rating > 5 || rating < 0)
        return res.status(400).json({ message: "Rating is between range 0-5" });

      const result = await this.repo.update(Number(req.params.id), {
        comment,
        rating,
      });
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      if (error instanceof URIError)
        return res.status(400).json({ message: `${error}` });

      res.status(404).json({ message: "Content not found" }).end();
    }
  };

  public delete: RequestHandler<
    ID,
    IContent | string | IErrorDto,
    undefined,
    undefined,
    AuthStatus
  > = async (req, res) => {
    try {
      const { ownerId } = await this.repo.getById(Number(req.params.id));

      if (ownerId !== res.locals.user.id)
        return res
          .status(403)
          .json({ message: "You're not a owner this content" })
          .end();

      const result = await this.repo.delete(Number(req.params.id));
      console.log(result);

      return res.status(200).json(result).end();
    } catch (error) {
      console.error(error);
      if (error instanceof URIError)
        return res.status(400).json({ message: `${error}` });

      res
        .status(404)
        .json({ message: "Can't delete because content not found" })
        .end();
    }
  };
}
