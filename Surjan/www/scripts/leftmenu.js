var leftmenu;
var nav_items;
var lastItem;
var lm_subcon;

var mbbm = "menu";

var srnb_lower;
var srnb_higher;

function lm_nav_item_click(event) {
    lm_hide();
    var nav_name = this.getAttribute("name");
    if (nav_name == "company_info") {
        ui_navigate("pages", "company_info");
    } else if (nav_name == "share") {
        navigator.share(gls.share_app_text[lang], "Share Surjan Kirana", "text/plain")
    } else if (nav_name == "change_city") {
        reSelectCity();
    } else if (nav_name == "logout") {
        setTimeout(confirmLogout, 1000);
    } else {
        ui_navigate(this.getAttribute("name"));
    }
    
}


// UI
var lm_animation;
var lm_isopen = false;
function lm_hide() {
    lm_isopen = false;
    lm_animation.left = "-70%";
    ui_hide_srnb_higher();
    anime(lm_animation);
}

function lm_show() {
    lm_isopen = true;
    lm_animation.left = "0";
    leftmenu.style.display = 'block';
    ui_show_srnb_higher(lm_hide);
    anime(lm_animation);
    animate_nav_items();
}

function animate_nav_items() {
    anime({
        targets: '#lm_subcon',
        opacity: 1,
        marginLeft: "0",
        duration: 1200,
        easing: 'easeOutExpo'
    });
}

function reset_nav_items() {
    lm_subcon.style.opacity = 0;
    lm_subcon.style.marginLeft = "-50px";
    leftmenu.style.display = 'none';
}

function leftmenu_init() {
    lm_animation = {
        targets: "#leftmenu",
        left: "0",
        duration: 800,
        easing: 'easeOutExpo',
        complete: function () {
            if (!lm_isopen) {
                reset_nav_items();
            }
        }
    };

    lm_subcon = crt_elt('lm_subcon');

    nav_items = document.querySelectorAll('.lm_nav_item');
    for (var i = 0; i < nav_items.length; i++) {
        nav_items[i].addEventListener('click', lm_nav_item_click);
    }
    lastItem = get("nav_item_mycart");
    leftmenu = get("leftmenu");
    srnb_lower = get("sb_lower");
    srnb_higher = get("sb_higher");
    get("hb_mmb").addEventListener("click", hb_mmb_click);

    $$("body").swipeRight(swipteRightHandler);
    $$("body").swipeLeft(swipteLeftHandler);
}

function swipteRightHandler(e) {
    if (e.srcElement.parentNode == mc_home_banners_con) return;
    var startX = e.iniTouch.x;
    var endX = e.currentTouch.x;
    if (startX < 80 && endX > 130) {
        lm_show();
    }
}

function swipteLeftHandler(e) {
    var startX = e.iniTouch.x;
    var endX = e.currentTouch.x;
    if (startX - endX > 100) {
        lm_hide();
    }
}

function lm_update_ui(pname) {
    if (lastItem) {
        lastItem.className = "lm_nav_item";
        lastItem = null;
    }
    for (var i = 0; i < nav_items.length; i++) {
        if (nav_items[i].getAttribute("name") == pname) {
            nav_items[i].className = "lm_nav_item lm_nav_item_active"
            lastItem = nav_items[i];
            break;
        }
    }
    if (lastItem) {
        mbbm = "menu";
        hb_mmb.src = "images/menu.png";
    } else {
        mbbm = "back";
        hb_mmb.src = "images/left_arrow.png";
    }
}
function hb_mmb_click() {
    if (mbbm == "menu") lm_show();
    else ui_goback();
}


function lm_setLogoutOption(isLogged) {
    get('lm_logout_item').style.display = isLogged ? 'block' : 'none';
}