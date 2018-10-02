import { SPPurge } from '../src';
import { getContext } from './utils/context';

getContext()
  .then(async context => {

    const sppurge = new SPPurge();

    const files = [
      `${context.siteUrl}/Shared Documents/sppurge/file-0.txt`,
      `${context.siteUrl}/Shared Documents/sppurge/with space1.txt`,
      `${context.siteUrl}/Shared Documents/sppurge/with%20space2.txt`
    ];

    for (const fileAbsolutePath of files) {
      await sppurge.deleteFileByAbsolutePath(context.authOptions, fileAbsolutePath)
        .catch(err => console.error(err.message));
    }

  })
  .then(_ => console.log('Done'))
  .catch(err => console.error(err.message));
