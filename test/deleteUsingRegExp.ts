import sppurge, { IOptionsByRegExp, IContext } from './../src';
import { getContext } from './utils/context';

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
  .then(_ => console.log('Done'))
  .catch(console.error);
