﻿var mc_home_banners;
var mc_home_categories;
var mc_home;
var mc_home_banners_dots_con;
function mc_home_init() {
    mc_home = get("mc_home");
    mc_home_banners = get("mc_home_banners");
    mc_home_categories = get("mc_home_categories");
    mc_home_banners_dots_con = get("mc_home_banners_dots_con");
    //mc_home_banners.addEventListener("touchstart", mc_home_banner_mousedown);
    //mc_home_banners.addEventListener("touchend", mc_home_banner_mouseup);
    //document.addEventListener('touchmove', doc_touchmove);

    $$("#mc_home_banners").swipeRight(mc_home_banner_swipeRight);
    $$("#mc_home_banners").swipeLeft(mc_home_banner_swipeLeft);

    mc_home_prt_load_categories();
    mc_home_startSlider();
}

function mc_home_ui_update() {
    //var realwidth = mc_home_banners.offsetWidth;
    //mc_home_banners.style.height = (realwidth * 0.4).toString() + "px";
}
function mc_home_prt_load_categories() {
    for (var i = 0; i < dm_prt_categories.length; i++) {
        var prt_category = dm_prt_categories[i];
        var prt_cat_con = crt_elt("div");
        var prt_cat_img = crt_elt("img", prt_cat_con);
        var prt_cat_break = crt_elt("br", prt_cat_con);
        var prt_cat_name = crt_elt("div", prt_cat_con);
        
        prt_cat_con.setAttribute("pid", prt_category.name);
        prt_cat_img.src = "images/icons/" + prt_category.icon_img;
        prt_cat_name.innerText = prt_category.display_name;

        prt_cat_con.addEventListener("click", prt_cat_click);

        mc_home_categories.appendChild(prt_cat_con);

    }
}

function prt_cat_click() {
    ui_navigate("products", this.getAttribute("pid"));
}

var mc_home_cbanner = 0;
function mc_home_slide(cb) {
    if (!mc_home_allow_slide) return;
    var w = window.innerWidth;
    var c = mc_home_banners.children[0].children.length;
    if (c < 2) return;
    var oi = mc_home_cbanner;
    mc_home_cbanner += cb;
    if (mc_home_cbanner >= c) mc_home_cbanner = 0;
    else if (mc_home_cbanner < 0) mc_home_cbanner = c - 1;

    mc_home_banners_dots_con.children[oi].style.backgroundColor = "";
    mc_home_banners_dots_con.children[mc_home_cbanner].style.backgroundColor = "aliceblue";
    
    //anime({
    //    targets: "#mc_home_banners_con > img:nth-child(" + (oi+1) + ")",
    //    marginLeft: '0',
    //    duration: 500,
    //    easing: 'easeOutExpo'
    //});
    anime({
        targets: "#mc_home_banners_con > img:nth-child(" + (mc_home_cbanner + 1) + ")",
        marginLeft: "-100%",
        opacity: 1,
        duration: 800,
        easing: 'easeOutExpo'
    });
}

var mc_home_slider_timer;
var mc_home_allow_slide = true;
function mc_home_startSlider() {
    mc_home_allow_slide = true;
    mc_home_slider_timer = setInterval(function () {
        mc_home_slide(1);
    }, 5000);
}

function mc_home_stopSlider() {
    mc_home_allow_slide = false;
    clearInterval(mc_home_slider_timer);
}

function mc_home_banner_swipeRight() {
    mc_banner_reset_timer();
    mc_home_slide(-1);
}
function mc_home_banner_swipeLeft() {
    mc_banner_reset_timer();
    mc_home_slide(1);
}

function mc_banner_reset_timer() {
    mc_home_stopSlider();
    mc_home_startSlider();
}