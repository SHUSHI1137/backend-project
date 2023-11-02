export interface IUserDto {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

export interface ICreateUserDto {
  username: string;
  name: string;
  password: string;
}
