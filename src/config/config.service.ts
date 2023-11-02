import { existsSync, readFileSync } from 'fs';
import Joi from 'joi';
import { ENV_FILE_PATH } from './config.constants';
import {
  BooleanEnvVariables,
  ConfigType,
  EnvConfig,
  NumberEnvVariables,
  SchemaType,
  StringEnvVariables,
} from './config.types';
import dotenv from 'dotenv';

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    let config = {};

    if (existsSync(ENV_FILE_PATH)) {
      config = dotenv.parse(readFileSync(ENV_FILE_PATH));
    }

    this.envConfig = this.validateInput({ ...process.env, ...config });
  }

  getString(key: StringEnvVariables): string {
    if (!!this.envConfig[key] && typeof this.envConfig[key] !== 'string') {
      throw new TypeError(
        `Config '${key}' not a string ${this.envConfig[key]}`,
      );
    }

    return this.envConfig[key] as string;
  }

  getNumber(key: NumberEnvVariables): number {
    if (this.envConfig[key] && typeof this.envConfig[key] !== 'number') {
      throw new TypeError(`Config ${key} not a number`);
    }

    return this.envConfig[key] as number;
  }

  getBoolean(key: BooleanEnvVariables): boolean {
    if (typeof this.envConfig[key] !== 'boolean') {
      throw new TypeError(`Config ${key} not a boolean`);
    }

    return this.envConfig[key] as boolean;
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const schema = {
      // App
      MODE: Joi.string()
        .valid('development', 'staging', 'production')
        .default('development'),
      PORT: Joi.number().default(3000),
    } as SchemaType;

    const envVarsSchema: Joi.ObjectSchema = Joi.object(schema);

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      {
        allowUnknown: true,
        stripUnknown: true,
      },
    );

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig as ConfigType;
  }
}