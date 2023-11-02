export type EnvConfig = Record<string, string | boolean | number | Array<number | string | boolean>>;

export type BooleanEnvVariables = never;

export type NumberEnvVariables = 'PORT';

export type StringEnvVariables = 'MODE';

export type SchemaType = {
  [key in StringEnvVariables | BooleanEnvVariables | NumberEnvVariables]: any;
};

export type ConfigType = {
  [keys in BooleanEnvVariables | StringEnvVariables | NumberEnvVariables]: boolean | string | number;
};
