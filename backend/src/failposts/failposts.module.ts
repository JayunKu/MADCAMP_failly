import { Module } from '@nestjs/common';
import { FailpostsController } from './failposts.controller';
import { FailpostsService } from './failposts.service';

@Module({
  controllers: [FailpostsController],
  providers: [FailpostsService]
})
export class FailpostsModule {}
