/**
 * Created by jonathan on 9/30/15.
 */

var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var path = require('path');

const PLUGIN_NAME = 'gulp-imagine-64';
const TEMPLATE = '\t"{key}": {\n\t\ttype: "{mimetype}",\n\t\tdata: "{data}"\n\t},';

function img64(options) {
    return through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported.'));
            return cb();
        }

        if (file.isBuffer()) {
            var s = options && options.template || TEMPLATE;
            var parts = path.parse(file.path);
            var ext = parts.ext.substr(1);
            var lowext = ext.toLowerCase();

            parts.key = file.relative.substr(0, file.relative.length - parts.ext.length);
            parts.ext = ext;
            parts.data = file.contents.toString('base64');
            parts.mimetype = img64.mimetypes[lowext] || 'image/' + lowext;

            for (var key in parts) {
                var globalKey = new RegExp('\\{' + key + '\\}', 'gi');
                s = s.replace(globalKey, parts[key]);
            }

            file.contents = new Buffer(s);
        }

        this.push(file);

        cb();
    });
}

img64.mimetypes = {
    jpg: 'image/jpeg',
    svg: 'image/svg+xml',
    ico: 'image/x-icon'
};

module.exports = img64;