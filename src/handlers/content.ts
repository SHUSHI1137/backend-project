import { RequestHandler } from "express";
import { IContent, IContentRepository } from "../repositories";
import { IContentDto, ICreateContentDto } from "../dto/content";
import { IErrorDto } from "../dto/error";
import { Empty, IContentHandler, ID } from ".";
import { oembedInfo } from "../utils/noembed";
export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }

  public getAll: RequestHandler<Empty, IContent[]> = async (req, res) => {
    const result = await this.repo.getAll();

    return res.status(200).json(result).end();
  };

  public getById: RequestHandler<ID, IContent> = async (req, res) => {
    const result = await this.repo.getById(Number(req.params.id));

    return res.status(200).json(result).end();
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
      return res.status(500).json({ message: `${error}` });
    }
  };
}
