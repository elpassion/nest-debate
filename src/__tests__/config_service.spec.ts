import { ConfigService, MissingEnvVariableError, EnvEntries } from '../config.module';

describe('ConfigService', () => {
  const configVariables: EnvEntries = {
    DATABASE_URL: 'postgresql://dbhost:5432/db-name',
    DATABASE_SYNCHRONIZE: 'true',
  };

  it('throws error on missing database url', () => {
    const { DATABASE_URL, ...configWithoutDbUrl } = configVariables;
    expect(() => {
      new ConfigService(configWithoutDbUrl);
    }).toThrowError(MissingEnvVariableError);
  });

  it('assigns database url', () => {
    const service = new ConfigService(configVariables);
    expect(service.databaseUrl).toEqual(configVariables.DATABASE_URL);
  });

  it('throws error on missing database synchronize', () => {
    const { DATABASE_SYNCHRONIZE, ...configWithoutDbSynchronize } = configVariables;
    expect(() => {
      new ConfigService(configWithoutDbSynchronize);
    }).toThrowError(MissingEnvVariableError);
  });

  describe.each([
    [ 'false', false ],
    [ 'true', true ],
  ])('setting db synchronize from string "%s"', (envStringValue, synchronize) => {
    it(`has \`${synchronize}\` value of databaseSynchronize`, () => {
      const service = new ConfigService({ ...configVariables, DATABASE_SYNCHRONIZE: envStringValue });
      expect(service.databaseSynchronize).toBe(synchronize);
    });
  });
});