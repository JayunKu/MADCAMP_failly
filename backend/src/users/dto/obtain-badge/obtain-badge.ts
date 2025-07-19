import { IsString } from 'class-validator';

export class ObtainBadgeDto {
  @IsString()
  tag: string;
}
