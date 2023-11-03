import express from "express";
import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import ContentHandler from "./handlers/content";
import ContentRepository from "./repositories/content";
import axios from "axios";

const PORT = Number(process.env.PORT || 8888);
const app = express();
const clnt = new PrismaClient();

const userRepo = new UserRepository(clnt);

const userHandler: IUserHandler = new UserHandler(userRepo);

const contentRepo = new ContentRepository(clnt);

const contentHandler: IContentHandler = new ContentHandler(contentRepo);

const jwtMiddleware = new JWTMiddleware();

app.use(express.json());

app.get("/", jwtMiddleware.auth, (req, res) => {
  return res.status(200).send("Welcome to LearnHub").end();
});

const userRouter = express.Router();

app.use("/user", userRouter);

userRouter.post("/", userHandler.registration);

const authRouter = express.Router();

app.use("/auth", authRouter);

authRouter.get("/me", jwtMiddleware.auth, userHandler.selfcheck);

authRouter.post("/login", userHandler.login);

const contentRouter = express.Router();

app.use("/content", contentRouter);

contentRouter.post("", jwtMiddleware.auth, contentHandler.create);

app.use(jwtMiddleware.auth, contentRouter);

contentRouter.get("/", contentHandler.getAll);

contentRouter.get("/:id", contentHandler.getById);

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
