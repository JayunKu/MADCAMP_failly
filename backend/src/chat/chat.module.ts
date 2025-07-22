import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],
  exports: [ChatGateway], // 다른 모듈에서 ChatGateway를 사용할 수 있도록 export
})
export class ChatModule {}
