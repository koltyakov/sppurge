# SPPurge - simple client to delete files from SharePoint document libraries

[![NPM](https://nodei.co/npm/sppurge.png?mini=true&downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/sppurge/)

[![npm version](https://badge.fury.io/js/sppurge.svg)](https://badge.fury.io/js/sppurge)
[![Downloads](https://img.shields.io/npm/dm/sppurge.svg)](https://www.npmjs.com/package/sppurge)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/sharepoint-node/Lobby)

Node.js module for files deletion from SharePoint document libraries.

## Supported SharePoint versions

- SharePoint Online
- SharePoint 2013
- SharePoint 2016

## How to use

### Install

```bash
npm install sppurge --save-dev
```

### Usage

```javascript
const sppurge = require('sppurge').default;

const context = {/*...*/};
const options = {/*...*/};

sppurge(context, options)
  .then(successHandler)
  .catch(errorHandler);
```

#### Arguments

##### Context

- `siteUrl` - SharePoint site (SPWeb) url [string, **required**]
- `creds`
  - `username` - user name for SP authentication [string, optional in case of some auth methods]
  - `password` - password [string, optional in case of some auth methods]

**Additional authentication options:**

Since communication module (sp-request), which is used in sppurge, had received additional SharePoint authentication methods, they are also supported in sppurge.

For more information please check node-sp-auth [credential options](https://github.com/s-KaiNet/node-sp-auth#params) and [wiki pages](https://github.com/s-KaiNet/node-sp-auth/wiki).

##### Options

- `folder` - relative folder in SharePoint to concat with filePath [string, optional, default: `` (empty string)]
- `filePath` - relative file path, with extention [string, required in general, optional if `localFilePath` and `localBasePath` are both provided]
- `localFilePath` - local full path to file [string, optional]
- `localBasePath` - relative folder base path within project directory [string, optional]

Result file path is formed based on the following rule:

- `siteUrl` + `folder` + `filePath`
- If `filePath` is empty, then:
  - `filePath` = path.resolve(localFilePath).replace(path.resolve(localBasePath), '')

#### successHandler

Callback gets called upon successful file deletion.

#### errorHandler

Callback gets executed in case of exception inside `sppurge`. Accepts error object as first argument for callback.

### Basic usage example (delete a single file)

```javascript
const sppurge = require('sppurge').default;

const context = { /* auth context */ };

const options = {
  folder: '/_catalogs/masterpage/spf/module_name',
  filePath: '/scripts/dummy-file.js'
};

sppurge(context, options)
  .then(deletionResults => {
    console.log('A file has been deleted');
  })
  .catch(err => {
    console.log('Core error has happened', err);
  });
```

### Basic usage example (delete a folder)

```javascript
const { Delete } = require('sppurge');

const context = { /* auth context */ };
const sppurge = new Delete();

sppurge.deleteFolder(context, '/sites/site/folder/repative/path')
  .then(deletionResults => {
    console.log('A folder has been deleted');
  })
  .catch(err => {
    console.log('Core error has happened', err);
  });
```

### Within Gulp task

```javascript
const gulp = require('gulp');
const watch = require('gulp-watch');      // Allows more than gulp.watch, is recommended
const spsave = require('gulp-spsave');    // Optional SPSave, but what is the reason to use SPPurge without SPSave?
const sppurge = require('sppurge').default;
const path = require('path');

const config = require('./gulp.config'); // Getting settings for SPPurge and SPSave

gulp.task('watch-assets', () => {
  return watch(config.watch.assets, function (event) {
    // Base local folder path, e.g. 'src' from which
    // project's files are mapped to SharePoint folder
    var watchBase = config.watch.base;

    // When file is deleted event value is "unlink"
    if (event.event === 'unlink') {
      var sppurgeOptions = {
        folder: config.sppurge.options.spRootFolder,
        filePath: path.resolve(event.path).replace(path.resolve(watchBase), '')
      };
      // OR:
      // const sppurgeOptions = {
      //   folder: config.sppurge.options.spRootFolder,
      //   localFilePath: event.path,
      //   localBasePath: watchBase
      // };
      sppurge(config.sppurge.context, sppurgeOptions)
        .then(res => console.log(`File has been deleted: ${res}`))
        .catch(err => console.log('Error', err.message));
    } else {
      // Saving files to SharePoint
      gulp.src(event.path, {
        base: watchBase
      }).pipe(
        spsave(
          // SPSave's core options, see more in spsave documentation
          config.spsave.coreOptions,
          // node-sp-auth / spsave credential object
          config.spsave.creds
        )
      );
    }
  });
});
```


### Create-React-App - Delete js build folder then upload all files from /build folder

```
const { AuthConfig } = require('node-sp-auth-config');
const { default: sppurge } = require('sppurge');
const spsave = require("spsave").spsave;

const authConfig = new AuthConfig({
  configPath: './config/private.json',
  encryptPassword: true,
  saveConfigOnDisk: true
});

const projectFolder = "MyFolder";

authConfig.getContext()
  .then(({ siteUrl, authOptions: creds }) => {
    const ctx = { siteUrl, creds };

    const sppurgeDeleteOptions = {
      folder: projectFolder + '/static/js',
      fileRegExp: new RegExp('(.*)/(.*)\.(js|txt|map)', 'i'), //all .js, .map, or .txt files , ignore case
      //filePath: 'SiteAssets/trash.txt' //if just one file
    };

    sppurge(ctx,sppurgeDeleteOptions)
      .then(_ => console.log('=========Files Deleted========='))
      .then( _ => {
          const spsaveCoreOptions = {
              siteUrl: ctx.siteUrl,
              notification: true,
              checkin: true,
              checkinType: 2 //0=minor, 1=major, 2=overwrite
          };

          const spsaveFileOptions = {
              glob: ['build/*.*', 'build/static/css/*.*' , 'build/static/js/*.*', 'build/static/media/*.*'], //source files
              base: 'build',
              folder: projectFolder, //destination folder
          };

          spsave(spsaveCoreOptions, ctx.creds , spsaveFileOptions)
            .then( _ => console.log('=========Files Uploaded=========') );
      });
  })
  .catch(err => console.log(err.message));
```


### Passwords storage

To eliminate any local password storing if preferable to use any two-way hashing technique, like [cpass](https://github.com/koltyakov/cpass).
