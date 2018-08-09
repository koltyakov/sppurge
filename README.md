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
var sppurge = require("sppurge").default;

var context = {/*...*/};
var options = {/*...*/};

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
  - `filePath` = path.resolve(localFilePath).replace(path.resolve(localBasePath), "")

#### successHandler

Callback gets called upon successful file deletion.

#### errorHandler

Callback gets executed in case of exception inside `sppurge`. Accepts error object as first argument for callback.

### Basic usage example

```javascript
var sppurge = require("sppurge").default;

var context = {
  siteUrl: "http://contoso.sharepoint.com/subsite",
  username: "user@contoso.com",
  password: "_Password_"
};

var options = {
  folder: "/_catalogs/masterpage/spf/module_name",
  filePath: "/scripts/dummy-file.js"
};

sppurge(context, options)
  .then(function(deletionResults) {
    console.log("File has been deleted");
  })
  .catch(function(err) {
    console.log("Core error has happened", err);
  });
```

### Within Gulp task

```javascript
var gulp = require('gulp');
var watch = require("gulp-watch");      // Allows more than gulp.watch, is recommended
var spsave = require("gulp-spsave");    // Optional SPSave, but what is the reason to use SPPurge without SPSave?
var sppurge = require('sppurge').default;
var path = require('path');

var config = require('./gulp.config'); // Getting settings for SPPurge and SPSave

gulp.task("watch-assets", function () {
  return watch(config.watch.assets, function (event) {
    // Base local folder path, e.g. 'src' from which
    // project's files are mapped to SharePoint folder
    var watchBase = config.watch.base;

    // When file is deleted event value is "unlink"
    if (event.event === "unlink") {
      var sppurgeOptions = {
        folder: config.sppurge.options.spRootFolder,
        filePath: path.resolve(event.path).replace(path.resolve(watchBase), "")
      };
      // OR:
      // var sppurgeOptions = {
      //   folder: config.sppurge.options.spRootFolder,
      //   localFilePath: event.path,
      //   localBasePath: watchBase
      // };
      sppurge(config.sppurge.context, sppurgeOptions)
        .then(function(res) {
          console.log("File has been deleted: " + res);
        })
        .catch(function(err) {
          console.log("Error", err.message);
        });
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

### Passwords storage

To eliminate any local password storing if preferable to use any two-way hashing technique, like [cpass](https://github.com/koltyakov/cpass).
