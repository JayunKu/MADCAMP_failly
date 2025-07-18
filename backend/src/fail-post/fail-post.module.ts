import { Module } from '@nestjs/common';
import { FailPostController } from './fail-post.controller';
import { FailPostService } from './fail-post.service';

@Module({
  controllers: [FailPostController],
  providers: [FailPostService]
})
export class FailPostModule {}
