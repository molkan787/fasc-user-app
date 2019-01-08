(function () {
    // Ajouter le polyfill safeHTML
    var scriptElem = crt_elt('script');
    scriptElem.setAttribute('src', 'scripts/winstore-jscompat.js');
    if (document.body) {
        document.body.appendChild(scriptElem);
    } else {
        document.head.appendChild(scriptElem);
    }
}());