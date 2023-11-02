import { RequestHandler } from "express";
import { IContentRepository } from "../repositories";
import { IContentDto, ICreateContentDto } from "../dto/content";
import { IErrorDto } from "../dto/error";
import { IContentHandler } from ".";

export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }

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
    if (typeof rating !== "number" || rating === 0)
      return res.status(400).json({ message: "Rating is invalid" });

    try {
      const result = await this.repo.create(res.locals.user.id, {
        videoUrl,
        comment,
        rating,
        creatorName: "",
        creatorUrl: "",
        thumbnaiUrl: "",
        videoTitle: "",
      });
      console.log(result);

      const returnContent: IContentDto = {
        ...result,
        postedBy: result.User,
      };

      return res.status(201).json(returnContent).end();
    } catch (error) {
      return res.status(500).json({ message: `Internal Server Error` });
    }
  };
}
