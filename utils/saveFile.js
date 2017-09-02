var fs = require("fs");
var uuid = require("uuid/v4");

module.exports = (content,filename) => {
    var extension = filename.split(".");
    var file = uuid()+"."+extension[extension.length-1];
    fs.writeFileSync('/'+uuid()+"."+extension[extension.length-1],content);
    return file;
}