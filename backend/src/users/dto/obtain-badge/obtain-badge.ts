import { IsNotEmpty, IsString } from 'class-validator';

export class ObtainBadgeDto {
  @IsString()
  @IsNotEmpty()
  tag: string;
}
