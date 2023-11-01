import { IUserHandler } from ".";
import { IUserRepository } from "../repositories";
import { hashPassword } from "../utils/bcrypt";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }

  public registration: IUserHandler["registration"] = async (req, res) => {
    const { name, username, password: plainPassword } = req.body;

    const {
      id,
      name: createdName,
      username: createdUsername,
      registeredAt,
    } = await this.repo.create({
      name,
      username,
      password: hashPassword(plainPassword),
    });

    return res
      .status(201)
      .json({
        id,
        name: createdName,
        username: createdUsername,
        registerdAt: `${registeredAt}`,
      })
      .end();
  };
}
