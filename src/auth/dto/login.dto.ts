import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  usernameOrEmail: string;

  @IsNotEmpty()
  password: string;
}
