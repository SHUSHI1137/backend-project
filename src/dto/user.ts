export interface IUserDto {
  id: string;
  username: string;
  name: string;
  registerdAt: string;
}

export interface ICreateUserDto {
  username: string;
  name: string;
  password: string;
}
