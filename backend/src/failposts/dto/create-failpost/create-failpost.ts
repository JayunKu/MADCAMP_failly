import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFailpostDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsOptional()
  @IsString()
  image_url?: string;  // 이미지가 선택적일 경우
}
