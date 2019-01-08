var ls_loading_img;
var ls_fail_msg;
function mxui_init() {
    loading_screen.addEventListener("click", loading_screen_click);
    ls_loading_img = get("ls_loading_img");
    ls_fail_msg = get("ls_fail_msg");
}


// Loading screen

var mxui_loading_failed = true;

function loading_screen_click(e) {
    if (e && e.srcElement && e.srcElement.tagName == "BUTTON") return;
    if (mxui_loading_failed) {
        mxui_loading_failed = false;
        anime({
            targets: "#ls_fail_msg",
            opacity: 0,
            easing: 'easeOutExpo',
            duration: 300,
            complete: function () {
                ls_fail_msg.style.display = "none";
                ls_loading_img.style.display = "inline-block";
                anime({
                    targets: "#ls_loading_img",
                    opacity: 1,
                    easing: 'easeOutExpo',
                    duration: 300
                });
            }
        });
        dm_load();
    }
}

function ls_loading_failed() {
    anime({
        targets: "#ls_loading_img",
        opacity: 0,
        easing: 'easeOutExpo',
        duration: 300,
        complete: function () {
            ls_loading_img.style.display = "none";
            ls_fail_msg.style.display = "block";
            anime({
                targets: "#ls_fail_msg",
                opacity: 1,
                easing: 'easeOutExpo',
                duration: 300,
                complete: function () {
                    mxui_loading_failed = true;
                }
            });
        }
    });
}

// ===================================