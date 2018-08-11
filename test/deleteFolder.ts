import { Delete, IContext } from './../src';
import { getContext } from './utils/context';

getContext()
  .then(context => {

    const sppurge = new Delete();
    const creds: IContext = {
      siteUrl: context.siteUrl,
      creds: context.authOptions
    };

    return sppurge.deleteFolder(creds, `${context.siteUrl}/Shared Documents/sppurge`);

  })
  .then(_ => console.log('Done'))
  .catch(console.error);
