var Promise = require('bluebird');
var spr = null;
var ctxCached = null;

var spf = spf || {};
spf.rest = spf.rest || {};

spf.rest.RestApi = function() {
    var _that = this;
    var getCachedRequest = function(ctx) {
        var env = {};
        if (JSON.stringify(ctxCached) === JSON.stringify(ctx)) {
            spr = spr || require("sp-request").create(ctx);
        } else {
            spr = require("sp-request").create(ctx);
        }
        return spr;
    };

    var operations = {};
    operations.deleteFile = function (context, filePath) {
        return new Promise(function(resolve, reject) {
            spr = getCachedRequest(context);
            return spr.requestDigest(context.siteUrl)
                .then(function (digest) {
                    var restUrl;
                    restUrl = context.siteUrl + "/_api/Web/GetFileByServerRelativeUrl(@FilePath)" +
                            "?@FilePath='" + encodeURIComponent(filePath) + "'";

                    return spr.post(restUrl, {
                        headers: {
                            "X-RequestDigest": digest,
                            "X-HTTP-Method": "DELETE",
                            "accept": "application/json; odata=verbose",
                            "content-type": "application/json; odata=verbose"
                        }
                    });
                }).then(function(res) {
                    resolve(filePath);
                }).catch(function(err) {
                    reject(err);
                });
        });
    };

    return operations;
};

module.exports = spf.rest;