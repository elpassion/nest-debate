import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { promisify } from 'util';
import { Module } from '@nestjs/common';

export interface EnvEntries { [key: string]: string; }

export class MissingEnvVariableError extends Error {
  constructor(envVariableName: string) {
    super(`Missing "${envVariableName}" env variable`);
  }
}

export class ConfigService {
  public readonly databaseUrl: string;
  public readonly databaseSynchronize: boolean;

  constructor(envEntries: EnvEntries) {
    this.databaseUrl = this.fetchVariableFromEnv(envEntries, 'DATABASE_URL');
    this.databaseSynchronize = this.fetchBooleanFromEnv(envEntries, 'DATABASE_SYNCHRONIZE');
  }

  private fetchBooleanFromEnv(envEntries: EnvEntries, name: string): boolean {
    const booleanString = this.fetchVariableFromEnv(envEntries, name);

    return booleanString === 'true';
  }

  private fetchVariableFromEnv(envEntries: EnvEntries, name: string): string {
    const variable = envEntries[name];
    if (typeof variable === 'undefined') { throw new MissingEnvVariableError(name); }

    return variable;
  }
}

class DotenvLoader {
  private readonly readFileAsync = promisify(fs.readFile);

  public async tryLoadFromFile(file): Promise<EnvEntries> {
    const envEntries = {};
    try {
      const filePath: string = path.join(process.cwd(), file);
      Object.assign(envEntries, dotenv.parse(await this.readFileAsync(filePath)));
    } catch (error) {
      // pass
    }

    return envEntries;
  }
}

class ConfigServiceFactory {
  constructor(private readonly _dotenvLoader: DotenvLoader) {}

  public async createFromEnv(env: string): Promise<ConfigService> {
    const envEntries = {};

    const [topLevelEnvs, envEnvs] = await Promise.all([
      this._dotenvLoader.tryLoadFromFile('.env'),
      this._dotenvLoader.tryLoadFromFile(`.env.${env}`),
    ]);

    Object.assign(envEntries, topLevelEnvs);
    Object.assign(envEntries, envEnvs);
    Object.assign(envEntries, process.env);

    return new ConfigService(envEntries);
  }
}

const configProvider = {
  provide: ConfigService,
  useFactory: async () => {
    return new ConfigServiceFactory(
      new DotenvLoader(),
    ).createFromEnv(process.env.NODE_ENV || 'development');
  },
};

@Module({
  providers: [configProvider],
  exports: [ConfigService],
})
export default class ConfigModule {}