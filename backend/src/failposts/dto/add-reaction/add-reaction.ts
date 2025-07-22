import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddReactionDto {
  @IsString()
  @IsNotEmpty()
  reaction_type: string;

  @IsNumber()
  @IsNotEmpty()
  delta: number;
}
