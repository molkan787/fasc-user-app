var mc_home_banners;
var mc_home_banners_con;
var mc_home_categories;
var mc_home;
var mc_home_banners_dots_con;
var home_categories;
var home_brands;
function mc_home_init() {
    mc_home = get("mc_home");
    mc_home_banners = get("mc_home_banners");
    mc_home_banners_con = get('mc_home_banners_con');
    mc_home_categories = get("mc_home_categories");
    mc_home_banners_dots_con = get("mc_home_banners_dots_con");

    home_categories = get('home_categories');
    home_brands = get('home_brands');

    $$("#mc_home_banners").swipeRight(mc_home_banner_swipeRight);
    $$("#mc_home_banners").swipeLeft(mc_home_banner_swipeLeft);

    
    get('gtype_btn1').onclick = gTypeBtn_Click;
    get('gtype_btn2').onclick = gTypeBtn_Click;

    mc_home_startSlider();
}

function mc_home_ui_update() {
}
function mc_home_prt_load_categories() {
    
    var cat_added = false;
    var brand_added = false;
    home_categories.innerHTML = '';
    home_brands.innerHTML = '';
    for (var cat_id in dm_cats) {
        if (!dm_cats.hasOwnProperty(cat_id)) continue;
        var prt_category = dm_cats[cat_id];
        var prt_cat_con = crt_elt("div");
        var prt_cat_img = crt_elt("img", prt_cat_con);
        var prt_cat_break = crt_elt("br", prt_cat_con);
        var prt_cat_name = crt_elt("div", prt_cat_con);

        prt_cat_con.setAttribute("pid", cat_id);
        prt_cat_img.src = prt_category.image;
        prt_cat_name.innerText = prt_category.name.replace('&amp;', '&');

        prt_cat_con.addEventListener("click", prt_cat_click);

        if (prt_category.gtype == '1') {
            brand_added = true,
                home_brands.appendChild(prt_cat_con);
        } else {
            cat_added = true;
            home_categories.appendChild(prt_cat_con);
        }

    }
    if (!cat_added) {
        setPlaceHolderIcon('box', txt('nothing_to_show'), home_categories);
    }
    if (!brand_added) {
        setPlaceHolderIcon('box', txt('nothing_to_show'), home_brands);
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

    var nextSlide = mc_home_banners_con.children[1];
    nextSlide.style.display = 'unset';
    nextSlide.style.left = (100 * cb) + '%';
   
    anime(sliding_anim);
}

function sliding_completed() {
    var prevSlide = mc_home_banners_con.children[0];
    if (!prevSlide) return;
    prevSlide.style.display = 'none';
    prevSlide.style.opacity = 0;
    moveEltToEnd(prevSlide);
}
var sliding_anim = {
    targets: "#mc_home_banners_con > img:nth-child(2)",
    left: 0,
    opacity: 1,
    duration: 800,
    easing: 'easeOutExpo',
    complete: sliding_completed
};

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

var first_banner = true;
function reset_banners() {
    mc_banner_reset_timer();
    val("mc_home_banners_con", '');
    val(mc_home_banners_dots_con, '');
    first_banner = true;
}
function dm_add_banners(banners) {
    var mc_home_banners_con = get("mc_home_banners_con");
    for (var i = 0; i < banners.length; i++) {
        var banner = crt_elt("img");
        if (first_banner) {
            first_banner = false;
            banner.style.display = 'unset';
            banner.style.opacity = 1;
        }
        banner.src = banners[i].image;
        banner.setAttribute("items", banners[i].link);
        mc_home_banners_con.appendChild(banner);
        var ditspan = crt_elt("span");
        if (mc_home_banners_con.children.length == 1) ditspan.style.backgroundColor = "aliceblue";
        ditspan.style.marginRight = "2px";
        mc_home_banners_dots_con.appendChild(ditspan);
        banner.addEventListener("click", function () {
            ui_navigate("items_group", this.getAttribute("items"));
        });
    }
}

function gTypeBtn_Click() {
    var gtype = attr(this, 'gtype');
    if (gtype == 'brands') {
        get('gtype_btn1').className = '';
        get('gtype_btn2').className = 'active';
        home_categories.style.display = 'none';
        home_brands.style.display = 'block';
    } else {
        get('gtype_btn1').className = 'active';
        get('gtype_btn2').className = '';
        home_categories.style.display = 'block';
        home_brands.style.display = 'none';
    }
}