import * as Mocha from 'mocha';
// import { expect } from 'chai';

import { IContext } from '../src';
import { Content } from '../src/api/content';
import { getContext } from './utils/context';

describe(`sppurge tests`, () => {
  it(`should delete folder content`, function(done: Mocha.Done): void {

    this.timeout(30 * 1000);

    getContext()
      .then(context => {

        const content = new Content();
        const creds: IContext = {
          siteUrl: context.siteUrl,
          creds: context.authOptions
        };

        return content.getFolderContent(creds, `${context.siteUrl}/Shared Documents/sppurge/some_folder`);

      })
      .then(() => done())
      .catch(done);

  });
});
