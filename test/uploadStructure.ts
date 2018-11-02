import { spsave } from 'spsave';
import * as fs from 'fs';
import * as path from 'path';
import { IAuthContext } from 'node-sp-auth-config';

import { getContext } from './utils/context';

interface IProfile {
  src: string;
  dest: string;
}

const publishProfile: IProfile[] = [
  { src: './test/structure', dest: 'Shared Documents/sppurge' }
];

const walkSync = (dir: string, filelist: string[]): string[] => {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(file => {
    let filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    } else {
      filelist.push(filePath);
    }
  });
  return filelist;
};

async function publishAll(profiles: IProfile[], context: IAuthContext) {
  const coreOptions = {
    siteUrl: context.siteUrl,
    notification: false,
    checkin: true,
    checkinType: 1
  };
  for (const profile of profiles) {
    const files = await walkSync(profile.src, []);
    console.log(`=== Publishing "${profile.dest}" ===`);
    for (const file of files) {
      const fileOptions = {
        folder: `${profile.dest}/${path.dirname(path.relative(profile.src, file)).replace(/\\/g, '/')}`,
        fileName: path.basename(file),
        fileContent: fs.readFileSync(file)
      };
      await spsave(coreOptions, context.authOptions, fileOptions);
    }
  }
  return 'Done';
}

getContext()
  .then(context => publishAll(publishProfile, context))
  .then(console.log)
  .catch(error => console.error(error.message));
