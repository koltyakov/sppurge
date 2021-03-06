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
      const restUrl = `${anyChildUrl}/_api/web?$select=Url,ServerRelativeUrl`;
      this.spr.get(restUrl, {
        headers: {
          'Accept': 'application/json;odata=verbose'
        }
      })
        .then((response) => resolve(response.body.d))
        .catch((err) => {
          if (err.response.statusCode === 404) {
            const childUrlArr = anyChildUrl.split('/');
            childUrlArr.pop();
            const childUrl = childUrlArr.join('/');
            if (childUrlArr.length <= 2) {
              return reject(`Wrong url, can't get Web property`);
            } else {
              return resolve(this.getWebByAnyChildUrl(childUrl));
            }
          } else {
            return reject(err);
          }
        });
    });
  }

  private initContext = (context: IAuthOptions): void => {
    this.spr = createRequest(context);
  }

}
