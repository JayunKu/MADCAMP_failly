import { Module } from '@nestjs/common';
import { FailpostsService } from './failposts.service';
import { FailpostsController } from './failposts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [PrismaModule, ChatModule], // ChatModule 추가
  controllers: [FailpostsController],
  providers: [FailpostsService],
})
export class FailpostsModule {}
