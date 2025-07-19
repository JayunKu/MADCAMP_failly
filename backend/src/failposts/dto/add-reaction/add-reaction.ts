import { IsString } from 'class-validator';

export class AddReactionDto {
  @IsString()
  reaction_type: string;
}
