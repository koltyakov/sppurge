import * as path from 'path';

import { Delete } from './api';
import { Content } from './api/content';
import { Context } from './api/context';
import { formatTime, escapeUriPath } from './utils';

import { IAuthOptions } from 'node-sp-auth';
import {
  IContext,
  IOptions,
  IOptionsByFilePath,
  IOptionsByLocalBase,
  IOptionsByRegExp,
  IWebPathsCache
} from './interfaces';

export class SPPurge {

  private restApi: Delete;
  private webPathsCache: IWebPathsCache[] = [];

  constructor() {
    this.restApi = new Delete();
  }

  public delete(context: IContext, options: IOptions): Promise<void> {
    // Delete base by root folder and regular expression check
    if (
      typeof (options as IOptionsByRegExp).fileRegExp === 'object' &&
      typeof (options as IOptionsByRegExp).fileRegExp.test === 'function'
    ) {
      return new Content().getFolderContent(context, (options as IOptionsByRegExp).folder)
        .then(async ({ files }) => {
          for (const file of files) {
            if ((options as IOptionsByRegExp).fileRegExp.test(file.ServerRelativeUrl)) {
              console.log(`[${formatTime(new Date())}]`, 'SPPurge:',
                file.ServerRelativeUrl, '(delete)');
              await this.restApi.deleteFile(context, file.ServerRelativeUrl);
            }
          }
        });
    } else {
      // Delete base by strict path conditions
      let filePath = (options as IOptionsByFilePath).filePath;
      const folderPath = (options as IOptionsByFilePath).folder || '';

      if (typeof (options as IOptionsByFilePath).filePath === 'undefined') {
        if (
          typeof (options as IOptionsByLocalBase).localFilePath !== 'undefined' &&
          typeof (options as IOptionsByLocalBase).localBasePath !== 'undefined'
        ) {
          filePath = path.resolve((options as IOptionsByLocalBase).localFilePath)
            .replace(path.resolve((options as IOptionsByLocalBase).localBasePath), '');
        }
      }

      let fileUri = `${context.siteUrl}/${folderPath}/${filePath}`;
      fileUri = fileUri.replace(/\\/g, '/').replace(/\/\//g, '/');
      fileUri = fileUri.replace('http:/', '').replace('https:/', '');
      fileUri = fileUri.replace(fileUri.split('/')[0], '');

      // const localBasePath = (options as IOptionsByLocalBase).localBasePath || './';
      // path.relative(process.cwd(), path.join(localBasePath, filePath))

      console.log(`[${formatTime(new Date())}]`, `SPPurge: ${decodeURIComponent(fileUri)} (delete)`);

      return this.restApi.deleteFile(context, fileUri);
    }
  }

  public deleteFileByAbsolutePath(creds: IAuthOptions, fileAbsolutePath: string): Promise<void> {
    const fileAbsPath = escapeUriPath(fileAbsolutePath);
    return this.getWebByAnyChildUrl(creds, fileAbsolutePath).then(siteUrl => {
      return this.delete({ siteUrl, creds }, {
        filePath: fileAbsPath.replace(`${siteUrl}/`, '')
      } as IOptionsByFilePath);
    });
  }

  private async getWebByAnyChildUrl(creds: IAuthOptions, fileAbsolutePath: string): Promise<string> {
    const fileAbsPath = escapeUriPath(fileAbsolutePath);
    let wpc: IWebPathsCache[] = [];
    // Search web url in cache
    wpc = this.webPathsCache.filter(({ folders }) => {
      return folders.filter(f => {
        return fileAbsPath.indexOf(f) !== -1;
      }).length > 0;
    });
    if (wpc.length > 0) {
      return wpc[0].webUrl;
    }
    // Getting web url with API requests
    const { Url } = await new Context(creds).getWebByAnyChildUrl(fileAbsPath);
    const webUrl = escapeUriPath(Url);
    const folder = `${webUrl}/${fileAbsPath.replace(`${webUrl}/`, '').split('/')[0]}`;
    wpc = this.webPathsCache.filter(w => w.webUrl === webUrl);
    if (wpc.length === 0) {
      this.webPathsCache.push({
        webUrl,
        folders: [ folder ]
      });
    }
    return webUrl;
  }

}

const sppurge = new SPPurge();
const purge = sppurge.delete.bind(sppurge);

export default purge;
