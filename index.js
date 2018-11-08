/**
 * Created by jonathan on 9/30/15.
 */

var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var path = require('path');

const PLUGIN_NAME = 'gulp-imagine-64';
const TEMPLATE = '\t"{key}": {\n\t\ttype: "{mimetype}",\n\t\tdata: "{data}"\n\t},';

const mimetype = {
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    ico: 'image/x-icon'
};
mimetype.jpeg = mimetype.jpg;

module.exports = function(options) {
    return through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported.'));
            return cb();
        }

        if (file.isBuffer()) {
            var s = options && options.template || TEMPLATE;
            var parts = path.parse(file.path);

            parts.key = file.relative.substr(0, file.relative.length - parts.ext.length);
            parts.ext = parts.ext.substr(1);
            parts.data = file.contents.toString('base64');
            parts.mimetype = mimetype[parts.ext.toLowerCase()];

            for (var key in parts) {
                var globalKey = new RegExp('\\{' + key + '\\}', 'gi');
                s = s.replace(globalKey, parts[key]);
            }

            file.contents = new Buffer(s);
        }

        this.push(file);

        cb();
    });
};