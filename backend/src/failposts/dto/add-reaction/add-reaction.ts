import { IsNotEmpty, IsString } from 'class-validator';

export class AddReactionDto {
  @IsString()
  @IsNotEmpty()
  reaction_type: string;
}
