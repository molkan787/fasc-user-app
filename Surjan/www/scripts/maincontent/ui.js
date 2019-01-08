var ui_previous_pns = [];
var ui_previous_panel;
var ui_current_panel;
var maincontent;
var hb_text;

var gl_msg;
var gl_msg_text_sp;
var gl_msg_yes;
var gl_msg_no;


var gl_popup;
var gl_popup_elt;
var gl_popup_yes;
var gl_popup_no;
var ui_srnb_callback;
var hb_btn_cart_con;
var elts_holder;
var mc_help;
var mc_pages;
var hb_btn_search;
var mc_items_group;

var order_chat;
var order_phone;

var gl_allow_sui = false;

var ANIM_SLIDE_NEW = 1001;
var ANIM_HIDE_PREVIUS = 1002;

var pages = {};

function ui_init() {

    order_chat = get("order_chat");
    order_phone = get("order_phone");
    mc_items_group = get("mc_items_group");
    mc_help = get("mc_help");
    maincontent = get("maincontent");
    hb_text = get("hb_text");
    hb_btn_cart_con = get("hb_btn_cart_con");

    elts_holder = get("elts_holder");
    hb_btn_search = get("hb_btn_search");

    mc_pages = get("mc_pages");

    gl_msg = get("gl_msg");
    gl_msg_text_sp = get("gl_msg_text_sp");
    gl_msg_yes = get("gl_msg_yes");
    gl_msg_no = get("gl_msg_no");
    
    gl_popup = get("gl_popup");
    gl_popup_elt = get("gl_popup_elt");
    gl_popup_yes = get("gl_popup_yes");
    gl_popup_no = get("gl_popup_no");

    ui_current_panel = mc_home;

    hb_btn_cart_con.onclick = (hb_btn_cart_con_click);
    get("sb_higher").onclick = (ui_srnb_click);
    get("sb_lower").onclick = (ui_srnb_click);

    gl_msg_yes.onclick = (gl_msg_yes_click);
    gl_msg_no.onclick = (gl_msg_no_click);

    gl_popup_yes.onclick = (gl_popup_yes_click);
    gl_popup_no.onclick = (gl_popup_no_click);

    hb_btn_search.onclick = hb_btn_search_click;
    

    hb_btn_bell.onclick = (function () {
        ui_navigate("notification");
    });
}

function hb_btn_cart_con_click() {
    ui_navigate("cart", null);
}


function registerPage(slug, elt, title, updater) {
    var _page = {
        slug: slug,
        elt: elt,
        title: title,
        updater: updater
    };

    pages[slug] = _page;

}

function ui_navigate(pagename, param, isback) {

    if (ui_previous_pns.length > 0 && ui_previous_pns[ui_previous_pns.length - 1].pname == pagename) return;

    if (pagename == "account") {
        var mc_red = mc_redtosuia();
        if (mc_red) {
            pagename = mc_red;
        }
    } else if (pagename.substr(0, 5) == "supin" && !mc_redtosuia() && !gl_allow_sui) {
        ui_goback();
        return;
    } else if (pagename == "items_group" && (param.replace(" ", "") == "" || /^[a-zA-Z]+$/.test(param))) {
        return;
    }

    gl_allow_sui = false;
    lm_update_ui(pagename);
    var nelt = ui_getElement(pagename);
    if (!nelt) return;
    ui_previous_panel = ui_current_panel;
    ui_current_panel = nelt;

    
    ui_update_pan_content(pagename, param);

    if (isback) {
        ui_open_page(ANIM_HIDE_PREVIUS);
    } else {
        ui_open_page(ANIM_SLIDE_NEW);
    }

    //maincontent.scrollTop = 0;


    ui_previous_pns.push({ pname: pagename, param: param });
    ui_update_headbar(pagename, param);
    
}

function ui_goback() {
    ui_previous_pns.pop();
    var prev = ui_previous_pns.pop();
    if (prev) {
        ui_navigate(prev.pname, prev.param, true);
    } else {
        if (ui_current_panel.id == "mc_home") {
            msg("Do you want to exit the app?", function () {
                navigator.app.exitApp();
            });
        } else {
            ui_navigate("home", "", true);
        }
    }
}

function ui_update_headbar(pname, param) {

    var _page = pages[pname];
    if (_page) {
        if (typeof _page.title == 'string') {
            hb_text.innerText = _page.title;
            return;
        } else if (typeof _page.title == 'function') {
            hb_text.innerText = _page.title(param);
            return;
        }
    }

    if (pname == "cart" || pname == "cart_recap") {
        hb_text.innerText = "Cart";
    } else if (pname == "help") {
        hb_text.innerText = "Contact us";
    } else if (pname == "account") {
        hb_text.innerText = "My account";
    } else if (pname == "search") {
        hb_text.innerText = "Search";
    } else if (pname == "add_addr") {
        hb_text.innerText = "Add address";
    } else if (pname == "pages") {
        hb_text.innerText = "Info";
    } else if (pname == "notification") {
        hb_text.innerText = "Notification";
    } else if (pname == "items_group") {
        hb_text.innerText = "Promotions";
    } else if (pname == "order_chat") {
        hb_text.innerText = "WhatsApp";
    } else if (pname == "order_phone") {
        hb_text.innerText = "Order on Phone";
    } else if (pname == "orders") {
        hb_text.innerText = "My Orders";
    } else {
        hb_text.innerText = AppName;
    }
}

function ui_getElement(name) {

    var _page = pages[name];
    if (_page) {
        return _page.elt;
    }

    if (name == "home") {
        return mc_home;
    } else if (name == "cart" || name == "cart_recap") {
        return mc_cart;
    } else if (name == "account") {
        return mc_account;
    } else if (name == "help") {
        return mc_help;
    } else if (name == "search") {
        return mc_search;
    } else if (name == "add_addr") {
        return mc_add_addr;
    } else if (name == "pages"){
        return mc_pages;
    } else if (name == "notification") {
        return mc_notification;
    } else if (name == "items_group") {
        return mc_items_group;
    } else if (name == "order_chat") {
        return order_chat;
    } else if (name == "order_phone") {
        return order_phone;
    } else if (name == "orders") {
        return mc_orders;
    }
}

function ui_update_pan_content(pagename, param) {

    var _page = pages[pagename];
    if (_page && _page.updater) {
        _page.updater(param);
        return;
    }

    if (pagename == "cart") {
        mc_cart_load();
        mc_cart_checkout.innerText = "Next";
        mc_cart_conshop.innerText = "Continue Shopping";
        mc_cart_recap.style.display = "none";
        mc_cart_list.style.display = "block";
    } else if (pagename == "cart_recap") {
        mc_cart_load_recap();
        mc_cart_checkout.innerText = "Checkout";
        mc_cart_conshop.innerText = "Go back";
        mc_cart_list.style.display = "none";
        mc_cart_recap.style.display = "block";
    } else if (pagename == "home") {
        mc_home_startSlider();
    } else if (pagename == "account") {
        account_load();
    } else if (pagename == "search") {
        mc_search_tb.value = "";
    } else if (pagename == "add_addr") {
        addr_a1.value = "";
        addr_a2.value = "";
        addr_pin.value = "";
    } else if (pagename == "pages") {
        mc_pages_set_content(param);
    } else if (pagename == "notification") {
        mc_notification_load();
    } else if (pagename == "items_group"){
        mc_items_group_load(param);
    } else if (pagename == "order_chat") {
        
    } else if (pagename == "search") {
        setTimeout(function () { mc_search_tb.focus(); }, 400);
    } else if (pagename == "orders") {
        mc_orders_load(param);
    }
}

function ui_open_page(anim) {
    if (anim == ANIM_SLIDE_NEW) {

        if (ui_current_panel) {
            ui_current_panel.style.opacity = 0;
            ui_current_panel.style.marginLeft = "100%";
            ui_current_panel.style.display = "block";
            anime({
                targets: "#" + ui_current_panel.id,
                opacity: 1,
                marginLeft: "0",
                duration: 500,
                easing: 'easeOutExpo',
                complete: function () {
                    ui_reset_previous_pan();
                }
            });
        }

    } else if (anim == ANIM_HIDE_PREVIUS) {
            ui_current_panel.style.opacity = 1;
            ui_current_panel.style.marginLeft = "0";
            ui_current_panel.style.display = "block";
            anime({
                targets: "#" + ui_previous_panel.id,
                opacity: 0,
                marginTop: "30%",
                duration: 700,
                easing: 'easeOutExpo',
                complete: function () {
                    ui_reset_previous_pan();
                }
            });
    }
}

function ui_reset_previous_pan() {
    if (ui_previous_panel.id == "mc_products") {
        mc_products_list.innerHTML = "";
    } else if (ui_previous_panel.id == "mc_cart") {
        mc_cart_list.innerHTML = "";
    } else if (ui_previous_panel.id == "mc_home") {
        mc_home_stopSlider();
    } else if (ui_previous_panel.id == "mc_search") {
        mc_search_list.innerHTML = "";
    }

    if (ui_previous_panel) {
        ui_previous_panel.style.display = "none";
        ui_previous_panel.style.marginTop = "0";
    }
}


function ui_show_srnb_higher(callback) {
    ui_srnb_callback = callback;
    srnb_higher.style.display = "block";
    anime({
        targets: "#sb_higher",
        opacity: 0.5,
        duration: 800,
        easing: 'easeOutExpo'
    });
}
function ui_hide_srnb_higher() {
    ui_srnb_callback = null;
    anime({
        targets: "#sb_higher",
        opacity: 0,
        duration: 800,
        easing: 'easeOutExpo',
        complete: function () {
            srnb_higher.style.display = "none";
        }
    });
}

function ui_srnb_click() {
    if (ui_srnb_callback) ui_srnb_callback();
}

function glui_update_cart_count() {
    get("hb_btn_cart_count").innerText = cart_items_count;

    if (cart_items_count == 0) {
        mc_cart_checkout.disabled = true;
        get("hb_btn_cart_count").style.opacity = 0;
    } else {
        mc_cart_checkout.disabled = false;
        get("hb_btn_cart_count").style.opacity = 1;
    }

} 

function glui_update_not_count() {
    hb_btn_bell_count.innerText = not_count;

    if (not_count == 0) {
        hb_btn_bell_count.style.opacity = 0;
    } else {
        hb_btn_bell_count.style.opacity = 1;
    }

} 

function ui_device_backBtn_click(e) {
    e.preventDefault();
    if (lm_isopen) lm_hide();
    else ui_goback();
}

var msg_call_back_no;
var msg_call_back_yes;
function msg(text, yesCallBack, noCallBack) {
    var is_ok_btn = (typeof noCallBack == 'number' && noCallBack == 1);
    msg_call_back_yes = yesCallBack;
    msg_call_back_no = noCallBack;
    gl_msg_text_sp.innerText = text;
    gl_msg_show(is_ok_btn);
}

function gl_msg_show(is_ok_btn) {
    get('gl_msg_no').style.display = is_ok_btn ? 'none' : 'unset';
    get('gl_msg_yes').innerText = is_ok_btn ? 'Ok' : 'Yes';

    gl_msg.style.display = "block";
    sb_higher.style.display = "block";
    anime({
        targets: "#gl_msg",
        top: "50%",
        opacity: "1",
        duration: 500,
        easing: 'easeOutExpo'
    });
    anime({
        targets: "#sb_higher",
        opacity: "0.5",
        duration: 500,
        easing: 'easeOutExpo'
    });
}
function gl_msg_hide() {
    anime({
        targets: "#gl_msg",
        top: "30%",
        opacity: "0",
        duration: 500,
        easing: 'easeOutExpo',
        complete: function () {
            gl_msg.style.display = "none";
            sb_higher.style.display = "none";
        }
    });
    anime({
        targets: "#sb_higher",
        opacity: "0",
        duration: 500,
        easing: 'easeOutExpo'
    });
}

function gl_msg_yes_click() {
    gl_msg_hide();
    if (msg_call_back_yes) msg_call_back_yes();
}
function gl_msg_no_click() {
    gl_msg_hide();
    if (msg_call_back_no) msg_call_back_no();
}


var popup_call_back_no;
var popup_call_back_yes;
function popup(elt, yesCallBack, noCallBack) {
    popup_call_back_yes = yesCallBack;
    popup_call_back_no = noCallBack;
    if (gl_popup_elt.children[0]) elts_holder.appendChild(gl_popup_elt.children[0]);
    gl_popup_elt.appendChild(elt);
    gl_popup_show();
}

function gl_popup_show() {
    gl_popup.style.display = "block";
    sb_higher.style.display = "block";
    anime({
        targets: "#gl_popup",
        top: "50%",
        opacity: "1",
        duration: 500,
        easing: 'easeOutExpo',
        complete: function () {
            console.log("Done");
        }
    });
    anime({
        targets: "#sb_higher",
        opacity: "0.5",
        duration: 500,
        easing: 'easeOutExpo'
    });
}

function gl_popup_hide() {
    anime({
        targets: "#gl_popup",
        top: "30%",
        opacity: "0",
        duration: 500,
        easing: 'easeOutExpo',
        complete: function () {
            gl_popup.style.display = "none";
            sb_higher.style.display = "none";
        }
    });
    anime({
        targets: "#sb_higher",
        opacity: "0",
        duration: 500,
        easing: 'easeOutExpo'
    });
}

function gl_show_wbp(txt) {
    txt = txt || "Please wait...";
    get("sb_wait_txt").innerText = txt;
    get("sb_wait").style.display = "block";
    anime({
        targets: "#sb_wait",
        opacity: "1",
        duration: 500,
        easing: 'easeOutExpo'
    });
}
function gl_hide_wbp() {
    anime({
        targets: "#sb_wait",
        opacity: "0",
        duration: 500,
        easing: 'easeOutExpo',
        complete: function () {
            get("sb_wait").style.display = "none";
        }
    });
}


function gl_popup_yes_click() {
    gl_popup_hide();
    if (popup_call_back_yes) popup_call_back_yes();
}
function gl_popup_no_click() {
    gl_popup_hide();
    if (popup_call_back_no) popup_call_back_no();
}


function hide_loadScreen() {
    anime({
        targets: "#loading_screen",
        opacity: 0,
        duration: 600,
        easing: 'easeOutExpo',
        complete: function () {
            get("loading_screen").style.display = "none";
        }
    });
}

function hb_btn_search_click() {
    ui_navigate("search");

    setTimeout(function () { mc_search_tb.focus(); Keyboard.show(); }, 300);
}
