import { IAuthOptions } from 'node-sp-auth';

export interface IContext {
  siteUrl: string;
  creds: IAuthOptions;
}

export type IOptions =
  | IOptionsByFilePath
  | IOptionsByLocalBase
  | IOptionsByFilePath & IOptionsByLocalBase
  | IOptionsByRegExp;

export interface IOptionsByFilePath {
  filePath: string;
  folder?: string;
}

export interface IOptionsByLocalBase {
  localFilePath: string;
  localBasePath: string;
}

export interface IOptionsByRegExp {
  fileRegExp: RegExp;
  folder: string;
}
