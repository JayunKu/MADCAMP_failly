import { Module } from '@nestjs/common';
import { FailpostsService } from './failposts.service';
import { FailpostsController } from './failposts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FailpostsController],
  providers: [FailpostsService],
})
export class FailpostsModule {}
