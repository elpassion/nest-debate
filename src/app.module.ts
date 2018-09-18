import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VotesController } from './votes/votes.controller';

@Module({
  imports: [],
  controllers: [AppController, VotesController],
  providers: [AppService],
})
export class AppModule {}
