var images = require('./images.js'); // images.js is generated by gulp

for (var key in images) {
    if (images.hasOwnProperty(key)) {
        var img = new Image();
        img.src = 'data:' + images[key].type + ';base64,' + images[key].data;
        exports[key] = img;
    }
}