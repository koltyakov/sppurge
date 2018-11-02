import sppurge, { IOptionsByFilePath, IContext } from '../src';
import { getContext } from './utils/context';

getContext()
  .then(context => {

    const creds: IContext = {
      siteUrl: context.siteUrl,
      creds: context.authOptions
    };

    const deleteOptions: IOptionsByFilePath = {
      filePath: 'Shared%20Documents/delete_me.txt'
    };

    return sppurge(creds, deleteOptions);

  })
  .then(_ => console.log('Done'))
  .catch(error => console.error(error.message));
