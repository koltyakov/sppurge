import * as Mocha from 'mocha';
// import { expect } from 'chai';

import sppurge, { IOptionsByFilePath, IContext } from '../src';
import { getContext } from './utils/context';

describe(`sppurge tests`, () => {
  it(`should delete using default settings`, function(done: Mocha.Done): void {

    this.timeout(30 * 1000);

    getContext()
      .then(context => {

        const creds: IContext = {
          siteUrl: context.siteUrl,
          creds: context.authOptions
        };

        const deleteOptions: IOptionsByFilePath = {
          filePath: 'Shared%20Documents/sppurge/delete_me.txt',
        };

        return sppurge(creds, deleteOptions);

      })
      .then(() => done())
      .catch(done);

  });
});
