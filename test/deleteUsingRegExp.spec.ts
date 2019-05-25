import * as Mocha from 'mocha';
// import { expect } from 'chai';

import sppurge, { IOptionsByRegExp, IContext } from '../src';
import { getContext } from './utils/context';

describe(`sppurge tests`, () => {
  it(`should delete using regular expressions`, function(done: Mocha.Done): void {

    this.timeout(30 * 1000);

    getContext()
      .then(context => {

        const creds: IContext = {
          siteUrl: context.siteUrl,
          creds: context.authOptions
        };

        const deleteOptions: IOptionsByRegExp = {
          folder: `${context.siteUrl}/Shared Documents/sppurge`,
          fileRegExp: new RegExp('(.*)/(.*)\.(txt|map)', 'i')
        };

        return sppurge(creds, deleteOptions);

      })
      .then(() => done())
      .catch(done);

  });
});
