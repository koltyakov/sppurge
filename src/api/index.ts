import * as sprequest from 'sp-request';

import { escapeURIComponent } from './../utils';
import { IContext } from '../interfaces';

export class Delete {

  private spr: sprequest.ISPRequest;

  public deleteFile (context: IContext, filePath: string): Promise<any> {
    let restUrl = `${context.siteUrl}/_api/Web/GetFileByServerRelativeUrl(@FilePath)` +
      `?@FilePath='${escapeURIComponent(filePath)}'`;
    return this.deleteRequest(context, restUrl);
  }

  public deleteFolder (context: IContext, folderPath: string): Promise<any> {
    let restUrl = `${context.siteUrl}/_api/Web/GetFolderByServerRelativeUrl(@FolderPath)` +
      `?@FolderPath='${escapeURIComponent(folderPath)}'`;
    return this.deleteRequest(context, restUrl);
  }

  private deleteRequest = (context: IContext, restUrl: string): Promise<any> => {
    this.spr = this.getCachedRequest(context);
    return this.spr.requestDigest(context.siteUrl)
      .then(digest => {
        return this.spr.post(restUrl, {
          headers: {
            'X-RequestDigest': digest,
            'X-HTTP-Method': 'DELETE',
            'accept': 'application/json; odata=verbose',
            'content-type': 'application/json; odata=verbose'
          }
        });
      }) as any;
  }

  private getCachedRequest = (context: IContext): sprequest.ISPRequest => {
    return this.spr || sprequest.create(context.creds);
  }

}
