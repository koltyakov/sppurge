import * as Mocha from 'mocha';
// import { expect } from 'chai';

import { Delete, IContext } from '../src';
import { getContext } from './utils/context';

describe(`sppurge tests`, () => {
  it(`should delete folder`, function(done: Mocha.Done): void {
    this.timeout(30 * 1000);

    getContext()
      .then(context => {

        const sppurge = new Delete();
        const creds: IContext = {
          siteUrl: context.siteUrl,
          creds: context.authOptions
        };

        return sppurge.deleteFolder(creds, `${context.siteUrl}/Shared Documents/sppurge/sub_folder`);

      })
      .then(() => done())
      .catch(done);

  });
});
