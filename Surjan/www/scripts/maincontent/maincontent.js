function mc_init() {

    window._alert = window.alert;
    window.alert = function (text) {
        msg(text, null, 1);
    };

    mc_home_init();
    mc_products_init();
    mc_cart_init();
    account_init();
    mc_search_init();
    mc_notification_init();
    mc_banners_init();
    mc_orders_init();
    mxui_init();
    mc_ui_update();
}

function mc_ui_update() {
    mc_home_ui_update();
}

function mc_utils_getHelt(text) {
    var h1 = crt_elt("h1");
    h1.className = "mc_emty_text";
    h1.innerText = text;
    return h1;
}