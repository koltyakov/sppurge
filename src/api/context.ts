import { create as createRequest, ISPRequest } from 'sp-request';
import { IAuthOptions } from 'node-sp-auth';

export interface IWebData {
  Url: string;
  ServerRelativeUrl: string;
}

export class Context {

  private spr: ISPRequest;

  constructor (context: IAuthOptions) {
    this.initContext(context);
  }

  public getWebByAnyChildUrl(anyChildUrl: string): Promise<IWebData> {
    return new Promise((resolve, reject) => {
      let restUrl = `${anyChildUrl}/_api/web?$select=Url,ServerRelativeUrl`;
      this.spr.get(restUrl, {
        headers: {
          'Accept': 'application/json;odata=verbose'
        }
      })
        .then(response => resolve(response.body.d))
        .catch(err => {
          if (err.statusCode === 404) {
            let childUrlArr = anyChildUrl.split('/');
            childUrlArr.pop();
            let childUrl = childUrlArr.join('/');
            if (childUrlArr.length <= 2) {
              return reject(`Wrong url, can't get Web property`);
            } else {
              return resolve(this.getWebByAnyChildUrl(childUrl));
            }
          } else {
            return reject(err.message);
          }
        });
    });
  }

  private initContext = (context: IAuthOptions): void => {
    this.spr = createRequest(context);
  }

}
