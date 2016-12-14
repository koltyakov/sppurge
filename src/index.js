var fs = require('fs');
var path = require('path');
var RestApi = require(__dirname + '/rest/methods').RestApi;

var sppurge = function() {
    var _self = this;
    _self.restApi = new RestApi();

    _self.sppurge = function(context, options) {
        var filePath = null;
        if (typeof options.filePath === "undefined") {
            if (typeof options.localFilePath !== "undefined" && typeof options.localBasePath !== "undefined") {
                options.filePath = path.resolve(options.localFilePath).replace(path.resolve(options.localBasePath), "");
            }
        }
        filePath = context.siteUrl + "/" + (options.folder || "") + "/" + options.filePath;
        filePath = filePath.replace(/\\/g, "/").replace(/\/\//g, "/");
        filePath = filePath.replace("http:/", "").replace("https:/", "");
        filePath = filePath.replace(filePath.split("/")[0], "");
        console.log("sppurge: deleting file '" + filePath + "'");
        return _self.restApi.deleteFile(context, filePath);
    };

    return _self.sppurge;
};

module.exports = new sppurge();