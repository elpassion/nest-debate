import { Module } from '@nestjs/common';
import { DatabaseModule } from 'database.module';
import { debateRepositoryProviders } from './sql/debate_repository.provider';

@Module({
  imports: [DatabaseModule],
  providers: [...debateRepositoryProviders],
  exports: [...debateRepositoryProviders],
})
export class SqlRepositoriesModule {}