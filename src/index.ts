import * as fs from 'fs';
import * as path from 'path';

import RestAPI from './api';
import { formatTime } from './utils';

import { IContext, IOptions } from './interfaces';

export class Delete {

  private restApi: RestAPI;

  constructor () {
    this.restApi = new RestAPI();
  }

  public sppurge (context: IContext, options: IOptions): Promise<any> {

    let filePath = null;
    if (typeof options.filePath === 'undefined') {
      if (typeof options.localFilePath !== 'undefined' && typeof options.localBasePath !== 'undefined') {
        options.filePath = path.resolve(options.localFilePath)
          .replace(path.resolve(options.localBasePath), '');
      }
    }
    filePath = `${context.siteUrl}/${(options.folder || '')}/${options.filePath}`;
    filePath = filePath.replace(/\\/g, '/').replace(/\/\//g, '/');
    filePath = filePath.replace('http:/', '').replace('https:/', '');
    filePath = filePath.replace(filePath.split('/')[0], '');

    console.log(`[${formatTime(new Date())}]`, 'SPPurge:', path.relative('./', options.filePath), '(delete)');
    return this.restApi.deleteFile(context, filePath);
  }

}

const { sppurge } = new Delete();
export default sppurge;

export { IContext, IOptions } from './interfaces';