var mc_prt_hdr_scat;
var mc_prt_hdr_sscat;
var mc_products_list;

var mc_product;
var mc_prodp_name;
var mc_product_img;
var mc_prodp_prize;
var mc_prodp_spf;
var mc_prodp_spf_unit;
var mc_prodp_description;

var mc_prodp_crt_add;
var mc_prodp_crt_con;
var mc_prodp_crt_minus;
var mc_prodp_crt_count;
var mc_prodp_crt_plus;
var mc_prodp_crt_ofs;

var mc_prt_current_cat;
var cprt_images;
var prt_fav_btn;

var prtsLoadAction;
var prtLoadAction;

function mc_products_init() {
    mc_prt_hdr_scat = get("mc_prt_hdr_scat");
    mc_prt_hdr_sscat = get("mc_prt_hdr_sscat");
    mc_products_list = get("mc_products_list");

    prt_fav_btn = get('prt_fav_btn');
    
    mc_product = get("prt_popup");
    mc_prodp_name = get("mc_prodp_name");
    mc_product_img = get("mc_product_img");
    mc_prodp_prize = get("mc_prodp_prize");
    mc_prodp_spf = get("mc_prodp_spf");
    mc_prodp_spf_unit = get("mc_prodp_spf_unit");
    mc_prodp_description = get("mc_prodp_description");


    mc_prodp_crt_add = get("mc_prodp_crt_add");
    mc_prodp_crt_con = get("mc_prodp_crt_con");
    mc_prodp_crt_minus = get("mc_prodp_crt_minus");
    mc_prodp_crt_count = get("mc_prodp_crt_count");
    mc_prodp_crt_plus = get("mc_prodp_crt_plus");
    mc_prodp_crt_ofs = get('mc_prodp_crt_ofs');

    mc_prodp_crt_add.addEventListener("click", _mc_prt_cart_add);
    mc_prodp_crt_plus.addEventListener("click", _mc_prt_cart_plus);
    mc_prodp_crt_minus.addEventListener("click", _mc_prt_cart_minus);

    mc_products_list.addEventListener("scroll", mc_prts_scroll);

    get('prt_pp_btnl').onclick = prt_slide_image;
    get('prt_pp_btnr').onclick = prt_slide_image;

    get('mc_product_img').onload = revealMe;

    prt_fav_btn.onclick = favBtnClick;

    registerPage('products', mc_products, function (param) {
        var pcat_tl = dm_cats[param].name.replace("\n", " ").replace('&amp;', '&');
        if (pcat_tl.length > 16) pcat_tl = pcat_tl.substr(0, 15) + "...";
        return pcat_tl;
    }, mc_prt_load);

    registerPage('product', true, null, function (param) {
        mc_prt_show_product_page(param);
    }, mc_prt_hide_product_page);
    
    prtsLoadAction = fetchAction.create('product/list&side=client', prtsLoadActionCallback);
    prtLoadAction = fetchAction.create('product/info', prtLoadActionCallback);
}

function mc_prt_scat_addEventHandlers() {
    utils_applyForAll("#mc_prt_hdr_scat span", function (elt) {
        elt.addEventListener("click", mc_prt_hdr_scat_item_click);
    });
}

var mc_prt_hdr_sCatLastItem;
function mc_prt_hdr_scat_item_click() {
    //mc_prt_hdr_scat.parentNode.scrollLeft = this.offsetLeft - 60;
    scrollTo(mc_prt_hdr_scat.parentNode, this.offsetLeft - 60, 500);
    mc_prt_hdr_sCatLastItem.className = "";
    mc_prt_hdr_sCatLastItem = this;
    this.className = "mc_prt_hdr_scassc_activecat";
    prt_cscat = this.getAttribute("subcat");
    mc_prt_load_products(mc_prt_current_cat, prt_cscat , 0, 10);
}

function mc_prt_product_click(event) {
    if (event.srcElement.tagName == "BUTTON" || event.srcElement.tagName == "SPAN" || event.srcElement.getAttribute("cancelClick")) return;
    ui_navigate("product", this.getAttribute("pid"));
}

var prt_ccat;
var prt_cscat;
var prt_cpam;
var prt_gui_lc;
function mc_prt_load(cat) {
    prt_ccat = cat;
    prt_cscat = "all";
    prt_cpam = 10;
    mc_prt_current_cat = cat;
    mc_prt_load_sub_cats(cat);
    mc_prt_load_products(cat, "all", 0, 10);
}

function mc_prts_scroll() {
    if (ui_current_panel.id != "mc_products") return;
    if (prt_gui_lc.getBoundingClientRect().top < window.innerHeight) {
        mc_prt_load_products(prt_ccat, prt_cscat, prt_cpam, 10);
        prt_cpam += 10;
    }
}

// Mixed
// ========================================
var mc_prt_current;
function mc_prt_show_product_page(pid) {
    mc_prt_current = pid;
    mc_prt_load_product(pid);
    show_sb_higher2();
    mc_product.style.display = 'block';
}

function mc_prt_hide_product_page() {
    hide_sb_higher2();
    mc_product.style.display = 'none';
}

// UI part
// =========================================

var prt_cimg_i = 0;
function prt_slide_image() {
    var dir = parseInt(attr(this, 'sdir'));
    if (cprt_images.length < 2) return;
    prt_cimg_i += dir;
    if (prt_cimg_i < 0) prt_cimg_i = cprt_images.length - 1; // Wraping around
    else if (prt_cimg_i >= cprt_images.length) prt_cimg_i = 0; // Wraping around

    var imgSrc = cprt_images[prt_cimg_i];
    val('mc_product_img', imgSrc);
}

// --------------------

function mc_prt_load_sub_cats(cat) {
    mc_prt_hdr_scat.innerHTML = "";
    var subcats = dm_cats[cat].subs;
    if (!subcats) return;
    subcats.unshift({category_id: "all", name: "All"});
    for (var i = 0; i < subcats.length; i++) {
        var scatdata = subcats[i];
        var scatspan = crt_elt("span");
        scatspan.innerText = scatdata.name;
        scatspan.setAttribute("subcat", scatdata.category_id);
        mc_prt_hdr_scat.appendChild(scatspan);
        if (i == 0) {
            scatspan.className = "mc_prt_hdr_scassc_activecat";
            mc_prt_hdr_sCatLastItem = scatspan;
        }
    }
    subcats.shift();
    mc_prt_scat_addEventHandlers();
}

function prtsLoadActionCallback(action) {
    if (action.status == 'OK') {
        if (action.params.start == 0) mc_products_list.innerHTML = "";
        var products = action.data.items;
        pm_cache(products);
        for (var i = 0; i < products.length; i++) {
            var product_panel = mc_prt_ui_createProductPanel(products[i]);
            mc_products_list.appendChild(product_panel);
            product_panel.addEventListener("click", mc_prt_product_click);
        }
        if (products.length == 0 && action.params.start == 0) {
            setPlaceHolderIcon('box', txt('nothing_to_show'), mc_products_list);
        }
        prt_gui_lc = mc_products_list.children[mc_products_list.children.length - 1];
    } else {
        setNoNetPlaceHolder(mc_products_list);
    }
}

var pids = "";
function mc_prt_load_products(cat, subcat, offset, count) {
    if (offset == 0) setDimmer(mc_products_list, true);
    var params = {
        cat: cat,
        start: offset,
        limit: count
    };
    if (subcat != 'all') params.subcat = subcat;
    prtsLoadAction.do(params);
}

function mc_prt_ui_createProductPanel(product_data, isCart) {
    var _mcon = crt_elt("div");
    var _pimg = crt_elt("img", _mcon);
    var _title = crt_elt("h1", _mcon);
    var _spf = crt_elt("label", _mcon);
    var _break = crt_elt("br", _mcon);
    var _prize = crt_elt("span", _mcon);
    var _spf_unit = crt_elt("span");
    if(isCart) var _rm = crt_elt('button', _mcon);
    var _atc = crt_elt("div", _mcon);
    var fav_btn = crt_elt('button', _mcon);
    var fav_img = crt_elt('img', fav_btn);
    var _atc_btn = crt_elt("button");
    var _atc_btn_icon = crt_elt('img', _atc_btn);
    var _atc_btn_span = crt_elt('span', _atc_btn);
    var _atc_con = crt_elt("div");
    var _atc_pp = crt_elt("button");
    var _atc_pc = crt_elt("span");
    var _atc_pm = crt_elt("button");
    var _atc_ofs = crt_elt("label");

    if (isCart) {
        _rm.className = 't_btn prt_item_rm_btn';
        val(_rm, txt('remove'));
        attr(_rm, 'pid', product_data.product_id);
        _rm.onclick = cart_rm_btn_click;
    }

    fav_btn.className = 'item_fav_btn';
    fav_img.src = 'images/icons/heart_' + (product_data.in_wishlist ? 'filled' : 'outline') + '.png';
    attr(fav_btn, 'state', product_data.in_wishlist ? 1 : 0);
    attr(fav_btn, 'pid', product_data.product_id);
    attr(fav_btn, 'cancelclick', '1');
    attr(fav_img, 'cancelclick', '1');
    fav_btn.onclick = favBtnClick;

    var _disc_buble = crt_elt("a");
    _disc_buble.className = "prt_panel_disc_b";
    _mcon.appendChild(_disc_buble);

    var discount = product_data.discount_amt;
    if (discount > 0) {
        var iscd = (product_data.discount_amt != 1);
        _disc_buble.innerHTML = "-" + discount + (iscd ? "&#x20b9;" : "%");
    } else _disc_buble.style.display = "none";

    _mcon.setAttribute("pid", product_data.product_id);
    _mcon.id = "ppan_" + product_data.product_id;
    _mcon.className = 'prts_item';

    _pimg.src = product_data.image;
    _pimg.onload = revealMe;
    _pimg.setAttribute("id", "prt_min_" + product_data.product_id);
    _title.innerText = product_data.title;
    _spf.innerText = product_data.spf;
    _spf_unit.innerText = " " + product_data.spf_unit;
    _spf.appendChild(_spf_unit);

    var prize_html;
    if (discount > 0) {
        var pad = iscd ? product_data.price - discount : (product_data.price * (100 - discount) / 100);
        prize_html = '<span class="prt_prize_old">' + fasc.formatPrice(product_data.price) + '</span> <br />' + fasc.formatPrice(pad);
    } else {
        prize_html = '<br />' + fasc.formatPrice(product_data.price);
    }

    _prize.innerHTML = prize_html;

    val(_atc_btn_icon, 'images/icons/cart_white.png');
    val(_atc_btn_span, txt('add'));

    _atc.appendChild(_atc_btn);
    _atc.appendChild(_atc_con);
    _atc_con.appendChild(_atc_pm);
    _atc_con.appendChild(_atc_pc);
    _atc_con.appendChild(_atc_pp);
    _atc.appendChild(_atc_ofs);

    _atc_con.setAttribute("cancelClick", "1");

    _atc_ofs.innerHTML = "Out of stock";
    _atc_ofs.className = "atc_ofs_lbl";
    _atc_ofs.id = "patc_ofs_" + product_data.product_id;

    if (parseInt(product_data.quantity) > 0) _atc_ofs.style.display = "none";
    else _atc_btn.style.display = "none";

    _atc_btn.id = "patc_add_" + product_data.product_id;
    _atc_pc.id = "patc_count_" + product_data.product_id;
    _atc_con.id = "patc_con_" + product_data.product_id;

    _atc_btn.setAttribute("pid", product_data.product_id);
    _atc_pm.setAttribute("pid", product_data.product_id);
    _atc_pp.setAttribute("pid", product_data.product_id);

    _atc_btn.addEventListener("click", mc_prt_cart_add);
    _atc_pp.addEventListener("click", mc_prt_cart_plus);
    _atc_pm.addEventListener("click", mc_prt_cart_minus);

    _atc_pm.innerText = "-";
    _atc_pc.innerText = "1";
    _atc_pp.innerText = "+";


    var tpcount = cart_get_count(product_data.product_id);
    if (tpcount == 0) {
        _atc_con.style.display = "none";
    } else {
        _atc_btn.style.display = "none";
        _atc_pc.innerText = tpcount;
    }


    return _mcon;
}

function mc_prt_update_prt_pan(item) {
    var pid = item.pid;
    var ppan = get("ppan_" + pid);
    if (ppan) {
        var prtc_add = get("patc_add_" + pid);
        var prtc_con = get("patc_con_" + pid);
        var prtc_ofs = get("patc_ofs_" + pid);
        var cic = cart_get_count(pid);

        prtc_ofs.style.display = "none";
        prtc_add.style.display = "none";
        prtc_con.style.display = "none";

        if (item.stock == 0) {
            prtc_ofs.style.display = "unset";
            if (cic > 0) cart_remove(pid);
        } else {
            if (cic > item.stock) {
                cart_set_count(pid, item.stock);
                get("patc_count_" + pid).innerText = item.stock;
            }
            if (cic > 0) prtc_con.style.display = "block";
            else prtc_add.style.display = "inline-block";
        }
        var discount = item.discount;
        var disc_bubble = ppan.getElementsByTagName("a")[0];
        var prize_span = ppan.getElementsByTagName("span")[1];
        if (discount > 0) {
            var iscd = discount > 1000;
            if (iscd) discount -= 1000;
            disc_bubble.innerHTML = "-" + discount + (iscd ? "&#x20b9;" : "%");
            disc_bubble.style.display = "block";
        } else disc_bubble.style.display = "none";

        var prize_html;
        if (discount > 0) {
            var pad = iscd ? item.prize - discount : (item.prize * (100 - discount) / 100).toFixed(2);
            prize_html = '<span class="prt_prize_old">' + item.prize + '</span> ' + parseFloat(pad).toFixed(2) + ' &#x20b9;';
        } else {
            prize_html = item.prize + ' &#x20b9;';
        }
        prize_span.innerHTML = prize_html;
    } else {
        var cic = cart_get_count(pid);
        if (cic > item.stock) {
            cart_set_count(pid, item.stock);
        }
    }
}

function mc_prt_load_product(pid) {
    var product = pm_get_product(pid);
    var count = cart_get_count(pid);

    attr(prt_fav_btn, 'state', product.in_wishlist ? '1' : '0');
    attr(prt_fav_btn, 'pid', product.product_id);
    val('prt_fav_icon', 'images/icons/heart_' + (product.in_wishlist ? 'filled' : 'outline') + '.png');

    var mc_prodp_discount = get('mc_prodp_discount');

    mc_product_img.src = "images/loading.gif";
    mc_product_img.style.width = "20%";
    mc_product_img.style.height = "20%";
    mc_product_img.style.padding = "40%";

    var discount = parseInt(product.discount_amt);
    if (discount > 0) {
        mc_prodp_discount.style.display = 'inline-block';
        var iscd = (product.discount_type != 1);
        var pad = iscd ? fasc.formatPrice(product.price - discount) : fasc.formatPrice(product.price * (100 - discount) / 100);
        val(mc_prodp_discount, '-' + discount + (iscd ? '&#x20b9;' : '%'));
        mc_prodp_prize.className = '';
    } else {
        mc_prodp_discount.style.display = 'none';
        mc_prodp_prize.className = 'prt_pp_price_wd';
    }

    mc_prodp_name.innerText = product.title;
    mc_prodp_prize.innerHTML = fasc.formatPrice(pad ? pad : product.price);
    val('mc_prodp_oldp', pad ? fasc.formatPrice(product.price) : '');
    mc_prodp_spf.innerText = product.spf;
    mc_prodp_spf_unit.innerText = product.spf_unit;
    mc_prodp_description.innerHTML = '<div style="text-align:center;"><img class="ls_loading_img" src="images/loading.gif" /></div>';
    
    if (parseInt(product.quantity) <= 0) {
        mc_prodp_crt_ofs.style.display = 'unset';
        mc_prodp_crt_add.style.display = "none";
        mc_prodp_crt_con.style.display = "none";
    } else if (count > 0) {
        mc_prodp_crt_ofs.style.display = 'none';
        mc_prodp_crt_add.style.display = "none";
        mc_prodp_crt_con.style.display = "block";
        mc_prodp_crt_ofs.style.display = 'none';
        mc_prodp_crt_count.innerText = count;
    } else {
        mc_prodp_crt_ofs.style.display = 'none';
        mc_prodp_crt_add.style.display = "inline-block";
        mc_prodp_crt_con.style.display = "none";
    }

    prtLoadAction.do({ product_id: pid});
}

function prtLoadActionCallback(action) {
    if (action.status == 'OK') {
        set_prt_data(action.data);
    }
}

function set_prt_data(data) {
    cprt_images = [];
    cprt_images.push(data.image);
    for (var i = 0; i < data.images.length; i++) {
        cprt_images.push(data.images[i].image);
    }
    anime({
        targets: "#mc_product_img",
        opacity: 0,
        duration: 200,
        easing: 'easeOutExpo',
        complete: function () {
            mc_product_img.src = data.image;
            mc_product_img.style.width = "100%";
            mc_product_img.style.height = "100%";
            mc_product_img.style.padding = "0";
        }
    });
    anime({
        targets: "#mc_prodp_description",
        opacity: 0,
        duration: 200,
        easing: 'easeOutExpo',
        complete: function () {
            mc_prodp_description.innerHTML = data.d[fasc.lang].description;
            anime({
                targets: "#mc_prodp_description",
                opacity: 1,
                duration: 400,
                easing: 'easeOutExpo'
            });
        }
    });
}
