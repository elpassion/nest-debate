import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VotesController } from './votes/votes.controller';
import { provider as votesRepositoryProvider } from './repositories/in_memory_votes_repository';
import { provider as debatesRepositoryProvider } from './repositories/in_memory_debates_repository';
import { provider as votingServiceProvider } from './services/voting.service';

@Module({
  imports: [],
  controllers: [AppController, VotesController],
  providers: [debatesRepositoryProvider, votesRepositoryProvider, votingServiceProvider, AppService],
})
export class AppModule {}
