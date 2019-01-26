var ui_previous_pns = [];
var ui_previous_panel;
var ui_current_panel;
var ui_currentPopup;
var maincontent;
var hb_text;
var sb_higher2;

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
    fasc_init();
    mc_order_init();
    sb_higher2 = get('sb_higher2');
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

    sb_higher2.onclick = ui_goback;

    updateUiSizes();
    window.onresize = updateUiSizes;

    var order_phone = window.localStorage.getItem('order_phone') || '';
    attr('ls_fm_order_phone', 'href', 'tel:' + order_phone);

    ui_set_logo();
}

function hb_btn_cart_con_click() {
    ui_navigate("cart", null);
}


function registerPage(slug, elt, title, updater, hider) {
    var _page = {
        slug: slug,
        elt: elt,
        title: title,
        updater: updater,
        hider: hider,
        isPopup: (typeof elt == 'boolean' && elt)
    };

    pages[slug] = _page;

}

function push_history(pagename) {
    ui_previous_pns.push({ pname: pagename, param: '' });
}

function ui_navigate(pagename, param, isback) {
    if (ui_animating_page) return;

    var _page = pages[pagename];
    if (_page && _page.isPopup) {
        ui_currentPopup = _page;
        _page.updater(param);
        return;
    }

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

    if (pagename == 'orders' && isback) {
        
    } else {
        ui_update_pan_content(pagename, param);
    }

    if (isback) {
        ui_open_page(ANIM_HIDE_PREVIUS);
    } else {
        ui_open_page(ANIM_SLIDE_NEW);
    }

    //maincontent.scrollTop = 0;

    for (var i = 0; i < ui_previous_pns.length; i++) {
        if (ui_previous_pns[i].pname == pagename) {
            ui_previous_pns.splice(i, 1);
            break;
        }
    }
    ui_previous_pns.push({ pname: pagename, param: param });
    ui_update_headbar(pagename, param);
    
}

function ui_goback(forceUpdate) {
    if (ui_animating_page) return;
    if (ui_currentPopup) {
        if (ui_currentPopup.hider) ui_currentPopup.hider();
        ui_currentPopup = null;
        return;
    }
    var cur = ui_previous_pns.pop();
    if (cur.pname == 'search') {
        hideSearchBar();
    }
    var prev = ui_previous_pns.pop();
    if (prev) {
        ui_navigate(prev.pname, prev.param, forceUpdate ? false : true);
    } else {
        if (ui_current_panel.id == "mc_home") {
            msg(txt('confirm_app_exit'), function () {
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

    if (pname == "help") {
        hb_text.innerText = txt('contact_us');
    } else if (pname == "account") {
        hb_text.innerText = txt('my_account');
    } else if (pname == "add_addr") {
        hb_text.innerText = txt('add_address');
    } else if (pname == "pages") {
        hb_text.innerText = txt('company_info');
    } else if (pname == "notification") {
        hb_text.innerText = txt('notification');
    } else if (pname == "items_group") {
        hb_text.innerText = txt('promotions');
    } else if (pname == "order_chat") {
        hb_text.innerText = txt('whatsapp');
    } else if (pname == "order_phone") {
        hb_text.innerText = txt('order_on_phone');
    } else if (pname == "orders") {
        hb_text.innerText = txt('my_orders');
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
    } else if (name == "account") {
        return mc_account;
    } else if (name == "help") {
        return mc_help;
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

    if (pagename == "home") {
        mc_home_startSlider();
    } else if (pagename == "account") {
        account_load();
    } else if (pagename == "add_addr") {
        addr_a1.value = "";
        addr_a2.value = "";
        addr_pin.value = "";
        val('addr_city_opt', dm.city_names[lang]);
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
    } else if (pagename == 'help') {
        update_contact_page();
    } else if (pagename == 'order_phone') {
        attr('order_phone_link', 'href', 'tel:' + gls.orderPhone);
    }
}

var ui_animating_page = false;
function ui_open_page(anim) {
    ui_animating_page = true;
    if (anim == ANIM_SLIDE_NEW) {

        if (ui_previous_panel) ui_previous_panel.style.zIndex = 1;
        if (ui_current_panel) {
            ui_current_panel.style.zIndex = 2;
            ui_current_panel.style.opacity = 0;
            ui_current_panel.style.left = "100%";
            ui_current_panel.style.display = "block";
            anime({
                targets: "#" + ui_current_panel.id,
                opacity: 1,
                left: "0",
                duration: 500,
                easing: 'easeOutExpo',
                complete: function () {
                    ui_reset_previous_pan();
                }
            });
        }

    } else if (anim == ANIM_HIDE_PREVIUS) {
        ui_current_panel.style.zIndex = 1;
        ui_previous_panel.style.zIndex = 2;
        ui_current_panel.style.opacity = 1;
        ui_current_panel.style.left = "0";
        ui_current_panel.style.display = "block";
        anime({
            targets: "#" + ui_previous_panel.id,
            opacity: 0,
            top: "30%",
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
        ui_previous_panel.style.top = "0";
    }

    ui_animating_page = false;
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
        marginTop: "-25vw",
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
        opacity: 0,
        duration: 450,
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

function gl_show_wbp(text) {
    text = text || txt('please_wait');
    get("sb_wait_txt").innerText = text;
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
    setTimeout(function () {
        anime({
            targets: "#loading_screen",
            opacity: 0,
            duration: 600,
            easing: 'easeOutExpo',
            complete: function () {
                get("loading_screen").style.display = "none";
            }
        });
    }, 0);
    log('TODO: Delay loading screen hiding!');
}

function show_loadScreen() {
    get("loading_screen").style.display = "block";
    anime({
        targets: "#loading_screen",
        opacity: 1,
        duration: 400,
        easing: 'easeOutExpo',
        complete: function () {
        }
    });
}

function hb_btn_search_click() {
    ui_navigate("search");

    setTimeout(function () { mc_search_tb.focus(); Keyboard.show(); }, 300);
}

function hide_sb_higher2() {
    sb_higher2.style.display = 'none';
}
function show_sb_higher2() {
    sb_higher2.style.opacity = 0.3;
    sb_higher2.style.display = 'block';
}

function updateUiSizes() {
    get('prt_pp_desc').style.height = (window.innerHeight * 0.9 - window.innerWidth * 1.13) + 'px';
}

function ui_set_logo() {
    var logo_data = window.localStorage.getItem('logo_data');
    if (logo_data && logo_data.length) {
        val('ls_logo', logo_data);
        val('lm_logo', logo_data);
    }
    get('ls_logo').style.opacity = 1;
}