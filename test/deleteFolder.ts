import { AuthConfig } from 'node-sp-auth-config';
import { Delete } from './../src';

const authConfig = new AuthConfig({
  configPath: './config/private.json',
  encryptPassword: true,
  saveConfigOnDisk: true
});

authConfig.getContext()
  .then(context => {

    let sppurge = new Delete();
    sppurge.deleteFolder({
      siteUrl: context.siteUrl,
      creds: context.authOptions
    }, '/d/etalon/_catalogs/masterpage/spf/delete/webparts')
      .then(console.log)
      .catch(console.log);

  })
  .catch(error => {
    console.log(error);
  });
