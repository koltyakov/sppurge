import { IAuthOptions } from 'node-sp-auth';

export interface IContext {
  siteUrl: string;
  creds: IAuthOptions;
}

export interface IOptions {
  filePath?: string;
  localFilePath?: string;
  localBasePath?: string;
  folder?: string;
}
