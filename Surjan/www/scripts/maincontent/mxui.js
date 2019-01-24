var ls_loading_img;
var ls_fail_msg;
function mxui_init() {
    loading_screen.addEventListener("click", loading_screen_click);
    ls_loading_img = get("ls_loading_img");
    ls_fail_msg = get("ls_fail_msg");
}


// Loading screen

var mxui_loading_failed = false;

function loading_screen_click(e) {
    if (e && e.srcElement && e.srcElement.tagName == "BUTTON") return;
    if (mxui_loading_failed) {
        mxui_loading_failed = false;
        switchElements('ls_fail_msg', 'ls_loading_img');
        setTimeout(dm_load, 500);
    }
}

function ls_loading_failed() {
    mxui_loading_failed = true;
    switchElements('ls_loading_img', 'ls_fail_msg');
}

function switchElements(fromElt, toElt) {
    anime({
        targets: "#" + fromElt,
        opacity: 0,
        easing: 'easeOutExpo',
        duration: 300,
        complete: function () {
            get(fromElt).style.display = "none";
            var elt = get(toElt);
            elt.style.display = (elt.tagName == 'IMG') ? 'inline-block' : 'block';
            anime({
                targets: "#" + toElt,
                opacity: 1,
                easing: 'easeOutExpo',
                duration: 300
            });
        }
    });
}

// ===================================

function setDimmer(parent, clearContent, lp) {
    parent = get(parent);
    if (clearContent) parent.innerHTML = '';
    var img = crt_elt('img', parent);
    img.src = 'images/loading.gif';
    img.className = lp ? 't_dimmer_l' : 't_dimmer';
}

function setPlaceHolderIcon(icon, text, parent, clearContent) {
    parent = get(parent);
    if (clearContent) parent.innerHTML = '';
    var img = crt_elt('img', parent);
    var h3 = crt_elt('h3', parent);
    img.src = 'images/icons/' + icon + '_outline.png';
    img.className = 'ph_icon';
    val(h3, text);
    h3.className = 'ph_text';
}