function utils_applyForAll(selector, _function) {
    var std_items = document.querySelectorAll(selector);
    for (var i = 0; i < std_items.length; i++) {
        _function(std_items[i], i);
    }
}


function scrollTo(element, to, duration) {

    var start = element.scrollLeft,

        change = to - start,

        currentTime = 0,

        increment = 20;

    var animateScroll = function () {

        currentTime += increment;

        var val = Math.easeInOutQuad(currentTime, start, change, duration);

        element.scrollLeft = val;

        if (currentTime < duration) {

            setTimeout(animateScroll, increment);

        }

    };

    animateScroll();

}

Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};


function getAjax(url, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    return xhr;
}

function httpGetAsync(theUrl, callback, failcallback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
        else if (xmlHttp.status === 404)
            if (failcallback) {
                failcallback();
                failcallback = null;
            }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.addEventListener("error", failcallback);
    xmlHttp.send(null);
}
function httpPostAsync(theUrl, data, callback, failcallback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
        else if (xmlHttp.readyState == 4 && xmlHttp.status == 404)
            callback("HTTP_ERROR_404");
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.addEventListener("error", function () { callback("HTTP_ERROR"); });
    xmlHttp.send(data);
}

function genId(len) {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function split(str, sep, n) {
    var out = [];

    while (n--) out.push(str.slice(sep.lastIndex, sep.exec(str).index));

    out.push(str.slice(sep.lastIndex));
    return out;
}

function getDateStr() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) dd = '0' + dd;

    if (mm < 10) mm = '0' + mm;

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function downloadFile(base64, filename) {

    var dlnk = get('dwnldLnk');
    dlnk.setAttribute("download", filename);
    dlnk.href = "data:application/octet-stream;base64," + base64;

    dlnk.click();
    
}
/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (application/pdf - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

/**
 * Create a PDF file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
 */
function savebase64AsPDF(folderpath, filename, content, contentType) {
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content, contentType);

    console.log("Starting to write the file :3");

    window.resolveLocalFileSystemURL(folderpath, function (dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, { create: true }, function (file) {
            console.log("File created succesfully.");
            file.createWriter(function (fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function () {
                alert('Unable to save file in path ' + folderpath);
            });
        });
    });
}

function timestampToDate(time) {
    var date = new Date(time * 1000);
    var day = "0" + date.getDay();
    var month = "0" + date.getMonth();
    var year = date.getFullYear();
    return day.substr(-2) + "/" + month.substr(-2) + "/" + year;
}

function checkIfFileExists(path, fileExists, fileDoesNotExist) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getFile(path, { create: false }, fileExists, fileDoesNotExist);
    }, getFSFail); //of requestFileSystem
}

// ============================================

//window.log = function (log_content) {
//    console.log(log_content);
//};
window.log = console.log;
function crt_elt(tagname, parent, id) {
    var elt = document.createElement(tagname);
    if (parent) {
        if (typeof parent == 'string') {
            elt.id = parent;
        } else {
            parent.appendChild(elt);
        }
    }
    if (id) {
        elt.id = id;
    }
    return elt;
}

function style(elt, styles) {
    for (var p in styles) {
        if (styles.hasOwnProperty(p)) {
            elt.style[p] = styles[p];
        }
    }
}

function val(elt, value) {
    if (typeof elt == 'string') elt = get(elt);
    var p = get_primary_val_property(elt);

    if (typeof value != 'undefined') {
        elt[p] = value;
    }
    return elt[p];
}

function attr(elt, attr_name, value) {
    elt = get(elt);
    if (value) {
        elt.setAttribute(attr_name, value);
    }
    return elt.getAttribute(attr_name);
}

function attr_rm(elt, attr_name) {
    elt = get(elt);
    elt.removeAttribute(attr_name);
}

function class_rm(elt, className) {
    var _class = elt.className;
    _class = _class.replace(className, '');
    elt.className = _class;
}

function class_add(elt, className) {
    elt.className = (elt.className + ' ' + className).replace('  ', ' ');
}

function get(element_id) {
    if (typeof element_id == 'object') return element_id;
    return document.getElementById(element_id);
}

function get_bc(class_name, parent) {
    if (typeof parent == 'undefined') parent = document;
    return parent.getElementsByClassName(class_name);
}

function get_bt(tag_name, parent) {
    if (typeof parent == 'undefined') parent = document;
    return parent.getElementsByTagName(tag_name);
}

function get_primary_val_property(elt) {
    var tn = elt.tagName;
    if (tn == 'INPUT' || tn == 'SELECT' || tn == 'TEXTAREA')
        return 'value';
    else if (tn == 'IMG')
        return 'src';
    else
        return 'innerHTML';
}

function moveEltToEnd(elt) {
    elt.parentNode.appendChild(elt.parentNode.removeChild(elt));
}

function setOptions(parent, options, incAll, textProp, valueProp) {
    parent = get(parent);
    parent.innerHTML = '';

    var p_t = (typeof textProp == 'undefined') ? 'text' : textProp;
    var p_v = (typeof valueProp == 'undefined') ? 'id' : valueProp;

    if (options) {
        attr_rm(parent, 'disabled');
    } else {
        attr(parent, 'disabled', true);
        return;
    }

    if (typeof incAll != 'undefined') {
        var opt = crt_elt('option');
        opt.value = '';
        if (typeof incAll == 'boolean' && incAll)
        { val(opt, 'All'); parent.appendChild(opt); }
        else if (typeof incAll != 'boolean')
        { val(opt, incAll); parent.appendChild(opt); }
    }

    for (var i = 0; i < options.length; i++) {
        var opt = crt_elt('option', parent);
        val(opt, options[i][p_t]);
        opt.value = options[i][p_v];
    }
    parent.selectedIndex = 0;
}

function getSelectedText(elt) {
    elt = crt_elt(elt);
    if (elt.selectedIndex == -1)
        return null;
    return elt.options[elt.selectedIndex].text;
}


function foreach(arr, func) {
    var l = arr.length;
    for (var i = 0; i < l; i++) {
        if (func(arr[i])) {
            break;
        }
    }
}

function httpPostText(theUrl, text, callback, failcallback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
        else if (xmlHttp.status === 404)
            if (failcallback) {
                failcallback();
                failcallback = null;
            }
    }
    xmlHttp.open("POST", theUrl, true);
    xmlHttp.addEventListener("error", failcallback);
    xmlHttp.send(text);
}

function getBase64(file, callback, failCallback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        callback(reader.result);
    };
    reader.onerror = function (error) {
        if (failCallback)
            failCallback(error);
    };
}

var revealMeAnim = {
    targets: '',
    opacity: 1,
    easing: 'easeOutExpo',
    duration: 2000
};
function revealMe() {
    revealMeAnim.targets = '#' + this.id;
    anime(revealMeAnim);
}

var revealAnim = {
    targets: '',
    opacity: 1,
    duration: 500,
    easing: 'easeOutExpo'
};
function revealElt(elt) {
    elt = get(elt);
    revealAnim.targets = '#' + elt.id;
    revealAnim.opacity = 1;
    anime(revealAnim);
}
function hideElt(elt) {
    elt = get(elt);
    revealAnim.targets = '#' + elt.id;
    revealAnim.opacity = 0;
    anime(revealAnim);
}