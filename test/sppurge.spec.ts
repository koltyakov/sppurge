import * as Mocha from 'mocha';
import { IAuthContext } from 'node-sp-auth-config';

import sppurge, { SPPurge, Delete, IOptionsByFilePath, IContext, IOptionsByRegExp } from '../src';
import { Content } from '../src/api/content';
import { getContext } from './utils/context';

describe(`sppurge tests`, () => {

  let context: IAuthContext;

  before('preauthenticate for fair timings', function(done: Mocha.Done): void {
    this.timeout(30 * 1000);
    getContext().then((ctx) => {
      context = ctx;
      done();
    }).catch(done);
  });

  it(`should delete by absolute path`, function(done: Mocha.Done): void {
    this.timeout(30 * 1000);
    (async () => {

      const purge = new SPPurge();

      const files = [
        `${context.siteUrl}/Shared Documents/sppurge/file-0.txt`,
        `${context.siteUrl}/Shared Documents/sppurge/with space1.txt`,
        `${context.siteUrl}/Shared Documents/sppurge/with%20space2.txt`
      ];

      const errors: Error[] = [];
      for (const fileAbsolutePath of files) {
        await purge
          .deleteFileByAbsolutePath(context.authOptions, fileAbsolutePath)
          .catch(errors.push);
      }

      return errors;

    })()
      .then((errors) => {
        if (errors.length > 0) {
          throw new Error(errors.join('\n'));
        }
      })
      .then(() => done())
      .catch(done);
  });

  it(`should delete using default settings`, function(done: Mocha.Done): void {
    this.timeout(30 * 1000);
    (async () => {

      const creds: IContext = {
        siteUrl: context.siteUrl,
        creds: context.authOptions
      };

      const deleteOptions: IOptionsByFilePath = {
        filePath: 'Shared%20Documents/sppurge/delete_me.txt',
      };

      return sppurge(creds, deleteOptions);

    })()
      .then(() => done())
      .catch(done);
  });

  it(`should delete folder`, function(done: Mocha.Done): void {
    this.timeout(30 * 1000);
    (async () => {

      const purge = new Delete();
      const creds: IContext = {
        siteUrl: context.siteUrl,
        creds: context.authOptions
      };

      return purge.deleteFolder(creds, `${context.siteUrl}/Shared Documents/sppurge/sub_folder`);

    })()
      .then(() => done())
      .catch(done);
  });

  it(`should delete using regular expressions`, function(done: Mocha.Done): void {
    this.timeout(30 * 1000);
    (async () => {

      const creds: IContext = {
        siteUrl: context.siteUrl,
        creds: context.authOptions
      };

      const deleteOptions: IOptionsByRegExp = {
        folder: `${context.siteUrl}/Shared Documents/sppurge`,
        fileRegExp: new RegExp('(.*)/(.*)\.(txt|map)', 'i')
      };

      return sppurge(creds, deleteOptions);

    })()
      .then(() => done())
      .catch(done);
  });

  it(`should delete folder content`, function(done: Mocha.Done): void {
    this.timeout(30 * 1000);
    (async () => {

      const content = new Content();
      const creds: IContext = {
        siteUrl: context.siteUrl,
        creds: context.authOptions
      };

      return content.getFolderContent(creds, `${context.siteUrl}/Shared Documents/sppurge/some_folder`);

    })()
      .then(() => done())
      .catch(done);
  });

});
