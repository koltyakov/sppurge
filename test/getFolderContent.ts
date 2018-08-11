import { IContext } from './../src';
import { Content } from './../src/api/content';
import { getContext } from './utils/context';

getContext()
  .then(context => {

    const content = new Content();
    const creds: IContext = {
      siteUrl: context.siteUrl,
      creds: context.authOptions
    };

    return content.getFolderContent(creds, `${context.siteUrl}/Shared Documents/sppurge`);

  })
  .then(console.log)
  .catch(console.error);
