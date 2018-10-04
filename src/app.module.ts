import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VotesController } from './votes/votes.controller';
import { provider as votingServiceProvider } from './services/voting.service';
import { InMemoryRepositories } from './repositories/in_memory_repositories.module';

@Module({
  imports: [InMemoryRepositories],
  controllers: [AppController, VotesController],
  providers: [votingServiceProvider, AppService],
})
export class AppModule {}
