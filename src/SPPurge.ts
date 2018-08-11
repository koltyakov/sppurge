import * as path from 'path';

import { Delete } from './api';
import { Content } from './api/content';
import { formatTime } from './utils';

import { IContext, IOptions, IOptionsByFilePath, IOptionsByLocalBase, IOptionsByRegExp } from './interfaces';

class SPPurge {

  private restApi: Delete;

  constructor() {
    this.restApi = new Delete();
  }

  public delete = (context: IContext, options: IOptions): Promise<any> => {
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
      const localBasePath = (options as IOptionsByLocalBase).localBasePath || './';

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

      console.log(`[${formatTime(new Date())}]`, 'SPPurge:',
        path.relative(process.cwd(), path.join(localBasePath, filePath)),
        '(delete)');

      return this.restApi.deleteFile(context, fileUri);
    }
  }

}

const sppurge = (new SPPurge()).delete;

export default sppurge;
