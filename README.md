# gulp-imagine-64
Gulp plugin converts globs of image files to array of plain objects with base64 strings.

## Usage

```javascript
var gulp = require('gulp');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var img64 = require('gulp-imagine-64');

var img = require('./config').img64;

gulp.task('images', function() {
    return gulp.src(img.src.files, img.src.options)
        .pipe(img64(img.dest.options))
        .pipe(header(img.src.header))
        .pipe(footer(img.src.footer))
        .pipe(concat(img.dest.file))
        .pipe(header(img.dest.header))
        .pipe(footer(img.dest.footer))
        .pipe(gulp.dest(img.dest.dir));
});
```

_The above sample gulpfile.js can be found in the module folder (node_modules/gulp-imagine-64.js)._

## Output
See [`build/images.js`](https://github.com/joneit/gulp-imagine-64/blob/master/build/images.js) for some sample output.

## Configuration
The `img` object in the above usage example may be configured as follows:

```javascript
module.exports = {
    img64: {
        src: {
            globs: 'images/*.{gif,png,jpg,jpeg,svg,ico}',
            options: {}
        },
        transform: {
            options: {},
            header: '',
            footer: ''
        },
        dest: {
            path: 'build',
            filename: 'images.js',
            header: 'module.exports = { // This file generated by gulp-imagine-64 at '
                 + (new Date).toLocaleTimeString() + ' on '
                 + (new Date).toLocaleDateString() + '\n',
            footer: '\n};\n',
            options: {}
        }
    }
};
```

_The above sample config.js can be found in the module folder (node_modules/config.js)._

##### Required configuration data
The only _required_ fields are `glob` (input files) and `path`/`filename` (output file).

##### Configuration options
The `header`, `footer`, and `options` fields are all optional. You can give `''` and `{}` as I have done here for illustrative purposes; or you can omit them entirely. If you do omit `header` or `footer` you should remove or comment off the `.pipe()` call(s) that reference them as well.

### `img64.src.globs`
_Required._ Passed to `gulp.src()` as its [`globs`](https://github.com/gulpjs/gulp/blob/master/docs/API.md#globs) parameter.

### `img64.src.options`
_Optional._ Passed to `gulp.src()` as its [`options`](https://github.com/gulpjs/gulp/blob/master/docs/API.md#options) parameter. Although there's only one output file, note that `options.base` will affect the resulting image keys in that file just as it would normally affect the output files' pathnames. That is, the resulting keys will include the path relative to `base` (using slash as delimiter).

### `img64.transform.options.template`
_Optional._ You can provide an arbitrary template in `img64.transform.options.template` with variables. For each file in the `img64.src.files` glob, the template will substitute data for the following variables:

variable|substitution data
:---:|--------
`{name}` | the filename part of the current file (sans extension)
`{key}` | the relative path of the current file, relative to `base` (sans extension)
`{ext}` | the extension part of the current file (sans leading period)
`{mimetype}` | the extension mapped through the mime type table (see below)
`{data}` | the image file's data as a base64 string

Note that `{name}` and `{key}` are the same unless the files are in subfolders _and_ `img64.src.options.base` is given.

If not given, the default template is:
```javascript
    "{key}": {
        type: "{mimetype}",
        data: "{data}"
    },`
```

As of v2, the default template uses the new `{mimetype}` variable, which maps the extension (case-insensitive) to the correct [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#Image_types) through the [`img64.mimetypeDictionary`](#img65mimetypedictionary) hash. If not found, the value `images/{ext}` (but forced to lower case) is used. The hash can however be augmented or replaced before invoking the function.

**This is a potentially breaking change from v1 which used `image/{ext}`.** If your application monkey-patched the MIME type, you will need to either retire that patch or pass the [v1 template](https://github.com/joneit/gulp-imagine-64/blob/1.0.1/README.md#img64transformoptionstemplate) in the `img64.transform.options.template` option.

### `img64.transform.header`
_Optional._ String to prepend to the result of each transform.

### `img64.transform.footer`
_Optional._ String to append to the result of each transform.

### `img64.dest.path`
_Required._ Output folder path. Passed to `gulp.dest()` as its [`path`](https://github.com/gulpjs/gulp/blob/master/docs/API.md#path) parameter.

### `img64.dest.filename`
_Required._ Output filename. Passed to `concat()` as its `filename` "option" (required so not really an option).

### `img64.dest.header`
_Optional._ String to prepend to the entire output file.

### `img64.dest.footer`
_Optional._ String to append to the entire output file.

### `img64.dest.options`
_Optional._ Passed to `gulp.dest()` as its [`options`](https://github.com/gulpjs/gulp/blob/master/docs/API.md#options-1) parameter.

### `img64.mimetypes`
A hash of exceptional MIME types. MIME types that are a faithful reflection of the lower cased extension do not need to be included.

The default hash has the following keys and values:

Key<br>(lower cased `{ext}`) | Value<br>(`{mimetype}`)
:---: | :---:
`jpg` | `image/jpeg`
`svg` | `image/svg+xml`
`ico` | `image/x-icon`

The hash is dereferenced by the lower cased file extension.

It may be augmented or replaced in the gulpfile before invoking the function.

## Converting image data to DOM objects
See [`build/imagine.js`](https://github.com/joneit/gulp-imagine-64/blob/master/build/imagine.js) for an example module that consumes the data on the client side, producing a hash of usable `Image` DOM objects. (This mutates the original hash which isn't needed anymore. You could of course change this to preserve the original hash.)

## Version History
See [releases](https://github.com/joneit/gulp-imagine-64/releases).
