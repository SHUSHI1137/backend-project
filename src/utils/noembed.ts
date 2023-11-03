import axios from "axios";
import { ICreateContentDto } from "../dto/content";
import { OEmbedError, videoInfoDto } from "../dto/noembed";

const isError = (data: videoInfoDto | OEmbedError): data is OEmbedError =>
  Object.keys(data).includes("error");

export const oembedInfo = async (
  videoUrl: string
): Promise<
  Pick<
    ICreateContentDto,
    "videoTitle" | "videoUrl" | "thumbnaiUrl" | "creatorName" | "creatorUrl"
  >
> => {
  try {
    const result = await axios.get<videoInfoDto | OEmbedError>(
      `https://noembed.com/embed?url=${videoUrl}`
    );

    const oembedData = result.data;
    if (isError(oembedData)) throw new URIError("Invalid video link");

    const { title, author_name, author_url, thumbnail_url } = oembedData;

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
