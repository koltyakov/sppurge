import * as Promise from 'bluebird';
import * as sprequest from 'sp-request';

import { IContext } from '../interfaces';

export default class RestAPI {

    private context: IContext;
    private spr: sprequest.ISPRequest;

    constructor() {
        //
    }

    public deleteFile(context: IContext, filePath: string): Promise<any> {
        this.context = context;
        this.spr = this.getCachedRequest();
        return this.spr.requestDigest(this.context.siteUrl)
            .then((digest) => {
                let restUrl;
                restUrl = this.context.siteUrl + '/_api/Web/GetFileByServerRelativeUrl(@FilePath)' +
                        '?@FilePath=\'' + encodeURIComponent(filePath) + '\'';

                return this.spr.post(restUrl, {
                    headers: {
                        'X-RequestDigest': digest,
                        'X-HTTP-Method': 'DELETE',
                        'accept': 'application/json; odata=verbose',
                        'content-type': 'application/json; odata=verbose'
                    }
                });
            });
    }

    private getCachedRequest = (): sprequest.ISPRequest => {
        return this.spr || sprequest.create(this.context.creds);
    }

}
