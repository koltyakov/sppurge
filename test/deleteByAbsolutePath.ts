import { SPPurge } from '../src';
import { getContext } from './utils/context';

getContext()
  .then(context => {

    const fileAbsolutePath = `${context.siteUrl}/Shared Documents/sppurge/file-0.txt`;
    return new SPPurge().deleteFileByAbsolutePath(context.authOptions, fileAbsolutePath);

  })
  .then(_ => console.log('Done'))
  .catch(err => console.error(err.message));
