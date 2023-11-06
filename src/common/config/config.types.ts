export type EnvConfig = Record<string, string | boolean | number | Array<number | string | boolean>>;

export type BooleanEnvVariables = never;

export type NumberEnvVariables = 'PORT' | 'JWT_ACCESS_TOKEN_TTL';

export type StringEnvVariables = 'MODE' | 'JWT_SECRET' | 'MAIL_TRANSPORT' | 'MAIL_FROM_NAME';

export type SchemaType = {
  [key in StringEnvVariables | BooleanEnvVariables | NumberEnvVariables]: any;
};

export type ConfigType = {
  [keys in BooleanEnvVariables | StringEnvVariables | NumberEnvVariables]: boolean | string | number;
};
