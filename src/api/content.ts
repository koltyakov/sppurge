import * as https from 'https';
import * as colors from 'colors';
import * as sprequest from 'sp-request';

import { escapeURIComponent, trimMultiline, isUrlHttps } from './../utils';
import { IContext } from '../interfaces';
import { IContent, IFolder, IFile } from '../interfaces/content';
import { logger } from '../utils/logger';

export class Content {

  private spr: sprequest.ISPRequest;
  private agent: https.Agent;

  constructor() {
    this.agent = new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true,
      keepAliveMsecs: 10000
    });
  }

  public getFolderContent(context: IContext, spRootFolder: string): Promise<IContent> {
    return new Promise((resolve, reject) => {
      let restUrl: string;
      this.spr = this.getCachedRequest(context);

      if (spRootFolder.charAt(spRootFolder.length - 1) === '/') {
        spRootFolder = spRootFolder.substring(0, spRootFolder.length - 1);
      }

      restUrl = trimMultiline(`
        ${context.siteUrl}/_api/Web/GetFolderByServerRelativeUrl(@FolderServerRelativeUrl)
          ?$expand=Folders,Files,Folders/ListItemAllFields,Files/ListItemAllFields
          &$select=
            Folders/ListItemAllFields/Id,
            Folders/Name,Folders/UniqueID,Folders/ID,Folders/ItemCount,Folders/ServerRelativeUrl,Folder/TimeCreated,Folder/TimeLastModified,
            Files/Name,Files/UniqueID,Files/ID,Files/ServerRelativeUrl,Files/Length,Files/TimeCreated,Files/TimeLastModified,Files/ModifiedBy
          &@FolderServerRelativeUrl='${escapeURIComponent(spRootFolder)}'
      `);

      this.spr.get(restUrl, {
        agent: isUrlHttps(restUrl) ? this.agent : undefined
      })
        .then(async response => {
          let results: IContent = {
            folders: (response.body.d.Folders.results || []).filter(folder => {
              return typeof folder.ListItemAllFields.Id !== 'undefined';
            }),
            files: (response.body.d.Files.results || [])
          };
          let folders: IFolder[] = [];
          let files: IFile[] = [];
          for (const folder of results.folders) {
            if (folder.ItemCount !== 0) {
              const res = await this.getFolderContent(context, folder.ServerRelativeUrl);
              folders = folders.concat(res.folders);
              files = files.concat(res.files);
            }
          }
          results = {
            folders: results.folders.concat(folders),
            files: results.files.concat(files)
          };
          resolve(results);
        })
        .catch((err) => {
          logger.info(colors.red.bold('\nError in getFolderContent:'), colors.red(err.message));
          reject(err.message);
        });
    });
  }

  private getCachedRequest(context: IContext): sprequest.ISPRequest {
    return this.spr || sprequest.create(context.creds);
  }

}
