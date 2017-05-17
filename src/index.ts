import * as fs from 'fs';
import * as path from 'path';
import * as Promise from 'bluebird';

import RestAPI from './api';
import { IContext, IOptions } from './interfaces';

export class Delete {

    private context: IContext;
    private options: IOptions;
    private restApi: RestAPI;

    public sppurge(context: IContext, options: IOptions): Promise<any> {
        this.context = context;
        this.options = options;

        let filePath = null;
        if (typeof this.options.filePath === 'undefined') {
            if (typeof this.options.localFilePath !== 'undefined' && typeof this.options.localBasePath !== 'undefined') {
                this.options.filePath = path.resolve(this.options.localFilePath).replace(path.resolve(this.options.localBasePath), '');
            }
        }
        filePath = context.siteUrl + '/' + (this.options.folder || '') + '/' + options.filePath;
        filePath = filePath.replace(/\\/g, '/').replace(/\/\//g, '/');
        filePath = filePath.replace('http:/', '').replace('https:/', '');
        filePath = filePath.replace(filePath.split('/')[0], '');

        console.log("sppurge: deleting file '" + filePath + "'");
        return this.restApi.deleteFile(context, filePath);
    }

}

const sppurge = new Delete();
module.exports = sppurge;
