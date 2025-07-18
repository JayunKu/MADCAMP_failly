import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FailPostModule } from './fail-post/fail-post.module';

@Module({
  imports: [PrismaModule, FailPostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
