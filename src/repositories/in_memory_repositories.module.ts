import { Module } from '@nestjs/common';
import { repositoriesProviders } from './in_memory/repositories.providers';

@Module({
  providers: [...repositoriesProviders],
  exports: [...repositoriesProviders],
})
export class InMemoryRepositoriesModule {}