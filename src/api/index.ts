import * as sprequest from 'sp-request';

import { escapeURIComponent } from './../utils';
import { IContext } from '../interfaces';

export class Delete {

  private context: IContext;
  private spr: sprequest.ISPRequest;

  public deleteFile (context: IContext, filePath: string): Promise<any> {
    let restUrl = `${this.context.siteUrl}/_api/Web/GetFileByServerRelativeUrl(@FilePath)` +
      `?@FilePath='${escapeURIComponent(filePath)}'`;
    return this.deleteRequest(context, restUrl);
  }

  public deleteFolder (context: IContext, folderPath: string): Promise<any> {
    let restUrl = `${this.context.siteUrl}/_api/Web/GetFolderByServerRelativeUrl(@FolderPath)` +
      `?@FolderPath='${escapeURIComponent(folderPath)}'`;
    return this.deleteRequest(context, restUrl);
  }

  private deleteRequest = (context: IContext, restUrl: string): Promise<any> => {
    this.context = context;
    this.spr = this.getCachedRequest();
    return this.spr.requestDigest(this.context.siteUrl)
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

  private getCachedRequest = (): sprequest.ISPRequest => {
    return this.spr || sprequest.create(this.context.creds);
  }

}
