import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFailpostDto {
  @IsNumber()
  user_id: number;

  @IsString()
  text: string;

  @IsString()
  tag: string;

  @IsOptional()
  @IsString()
  image_url?: string;  // 이미지가 선택적일 경우
}
