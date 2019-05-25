import * as Mocha from 'mocha';
// import { expect } from 'chai';

import { SPPurge } from '../src';
import { getContext } from './utils/context';

describe(`sppurge tests`, () => {
  it(`should delete by absolute path`, function(done: Mocha.Done): void {

    this.timeout(30 * 1000);

    getContext()
      .then(async (context) => {

        const sppurge = new SPPurge();

        const files = [
          `${context.siteUrl}/Shared Documents/sppurge/file-0.txt`,
          `${context.siteUrl}/Shared Documents/sppurge/with space1.txt`,
          `${context.siteUrl}/Shared Documents/sppurge/with%20space2.txt`
        ];

        const errors: Error[] = [];
        for (const fileAbsolutePath of files) {
          await sppurge.deleteFileByAbsolutePath(context.authOptions, fileAbsolutePath)
            .catch(error => errors.push(error));
        }

        return errors;

      })
      .then((errors) => {
        if (errors.length > 0) {
          throw new Error(errors.join('\n'));
        }
      })
      .then(() => done())
      .catch(done);

  });
});
