import { AuthConfig } from 'node-sp-auth-config';

const authConfig = new AuthConfig({
  configPath: './config/private.json',
  encryptPassword: true,
  saveConfigOnDisk: true
});

export const getContext = () => authConfig.getContext();
