import { IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';

export class CreateFailpostDto {
  @IsString()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

}
