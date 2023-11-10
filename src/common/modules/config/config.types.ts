export type EnvConfig = Record<string, string | boolean | number | Array<number | string | boolean>>;

export type BooleanEnvVariables = never;

export type NumberEnvVariables = 'PORT' | 'JWT_ACCESS_TOKEN_TTL' | 'REDIS_PORT' | 'CONFIRM_CODE_TTL';

export type StringEnvVariables = 'MODE' | 'JWT_SECRET' | 'MAIL_TRANSPORT' | 'MAIL_FROM_NAME' | 'REDIS_HOST';

export type SchemaType = {
  [key in StringEnvVariables | BooleanEnvVariables | NumberEnvVariables]: any;
};

export type ConfigType = {
  [keys in BooleanEnvVariables | StringEnvVariables | NumberEnvVariables]: boolean | string | number;
};
