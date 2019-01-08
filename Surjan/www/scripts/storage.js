var _fs;
function storage_init() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        _fs;
        console.log('file system open: ' + fs.name);
        

    }, onErrorLoadFs);
}

function strg_crt_elt(name, callback) {
    if (!_fs) { console.log("No fs."); return; }
    _fs.root.getFile(name, { create: true, exclusive: false }, function (fileEntry) {
        readFile(fileEntry, callback);
    }, onErrorCreateFile);
}

function strg_set(name, data, callback) {
    if (!_fs) { console.log("No fs."); return; }
    _fs.root.getFile(name, { create: true, exclusive: false }, function (fileEntry) {
        writeFile(fileEntry, data, callback);
    }, onErrorCreateFile);
}


function readFile(fileEntry, callback) {

    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function () {
            console.log("Successful file read");
            callback(this.result);
        };

        reader.readAsText(file);

    }, onErrorReadFile);
}

function writeFile(fileEntry, dataObj, callback) {
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function () {
            callback("OK");
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['some file data'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
}

function onErrorLoadFs(e) { console.log(e); }
function onErrorCreateFile(e) { console.log(e); }
function onErrorReadFile(e) { console.log(e); }