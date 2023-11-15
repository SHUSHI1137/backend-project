import express from "express";
import { PrismaClient } from "@prisma/client";
import UserRepository from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import ContentHandler from "./handlers/content";
import ContentRepository from "./repositories/content";
import cors from "cors";
import { createClient } from "redis";
import BlacklistRepository from "./repositories/blacklist";

const PORT = Number(process.env.PORT || 8888);
const app = express();
const clnt = new PrismaClient();
const redisClnt = createClient();

const userRepo = new UserRepository(clnt);

const blacklistRepo = new BlacklistRepository(redisClnt);

const userHandler: IUserHandler = new UserHandler(userRepo, blacklistRepo);

const contentRepo = new ContentRepository(clnt);

const contentHandler: IContentHandler = new ContentHandler(contentRepo);

const jwtMiddleware = new JWTMiddleware();

app.use(express.json());
app.use(cors());

app.get("/", jwtMiddleware.auth, (req, res) => {
  return res.status(200).send("Welcome to LearnHub").end();
});

const userRouter = express.Router();

app.use("/user", userRouter);

userRouter.post("/", userHandler.registration);

userRouter.get("/:username", userHandler.findByUsername);

const authRouter = express.Router();

app.use("/auth", authRouter);

authRouter.get("/me", jwtMiddleware.auth, userHandler.findById);

authRouter.post("/login", userHandler.login);

const contentRouter = express.Router();

app.use("/content", contentRouter);

contentRouter.post("", jwtMiddleware.auth, contentHandler.create);

contentRouter.get("", contentHandler.getAll);

contentRouter.get("/:id", contentHandler.getById);

contentRouter.patch("/:id", jwtMiddleware.auth, contentHandler.update);

contentRouter.delete("/:id", jwtMiddleware.auth, contentHandler.delete);

//* endpoint test oembed
// app.post("/test", async (req, res) => {
//   const { url } = req.body;
//   const info = await axios.get(`https://noembed.com/embed?url=${url}`);

//   console.log(info.data);
//   return res.status(200).json(info.data).end();
// });

app.get("/", jwtMiddleware.auth, (req, res) => {
  return res.status(200).send("Welcome to LearnHub").end();
});

app.listen(PORT, () => {
  console.log(`LearnHub API is up at ${PORT}`);
});
