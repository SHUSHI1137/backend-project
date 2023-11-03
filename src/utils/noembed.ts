import axios from "axios";
import { ICreateContentDto } from "../dto/content";
import { videoInfoDto } from "../dto/noembed";

export const oembedInfo = async (
  videoUrl: string
): Promise<
  Pick<
    ICreateContentDto,
    "videoTitle" | "videoUrl" | "thumbnaiUrl" | "creatorName" | "creatorUrl"
  >
> => {
  try {
    const result = await axios.get<videoInfoDto>(
      `https://noembed.com/embed?url=${videoUrl}`
    );
    const { title, author_name, author_url, thumbnail_url } = result.data;
    console.log(title, author_name, author_url, thumbnail_url);

    return {
      videoTitle: title,
      creatorName: author_name,
      creatorUrl: author_url,
      thumbnaiUrl: thumbnail_url,
      videoUrl,
    };
  } catch (error) {
    console.error(error);
    throw new Error(`${error}`);
  }
};
