var dm_prt_categories;
var dm_prt_subcategories;
var dm_prt_products;
var dm_prt_discounts;

var dm_company_info;
var dm_del_cost;
var dm_order_phone_num;

var dm_images_cache = [];
var dm_desc_cache = [];
var checkTime = 0;

var dm_cache = {};
var storage;

var cav = "1.0.0";

function dm_init() {
    storage = window.localStorage;

    dm_prt_categories = [
        {
            name: "offers",
            display_name: "Offers",
            icon_img: "offers.png"
        },
        {
            name: "kirana_goods",
            display_name: "Kirana Goods",
            icon_img: "gtracker_icon.png"
        },
        {
            name: "dairy_break",
            display_name: "Dairy & Bread",
            icon_img: "32371-bread-icon.png"
        },
        {
            name: "household",
            display_name: "HouseHold",
            icon_img: "household.png"
        },
        {
            name: "fruits_vegetables",
            display_name: "Fruits & Vegetables",
            icon_img: "fruits_vegetables.png"
        },
        {
            name: "personal_care",
            display_name: "Personal Care",
            icon_img: "personal_care.png"
        },
        {
            name: "foods_snacks",
            display_name: "Foods & Snacks",
            icon_img: "snacks.png"
        },
        {
            name: "ayurvedic",
            display_name: "Ayurvedic Products",
            icon_img: "ayurvedic_icon.png"
        },
        {
            name: "electronic_accessories",
            display_name: "Electronic &\nAccessories",
            icon_img: "1600.png"
        },
        {
            name: "poojan_saamagri",
            display_name: "Poojan Saamagri",
            icon_img: "City-Modern-Statue-icon.png"
        },
        {
            name: "clothes_apparel",
            display_name: "Clothes & Apparel",
            icon_img: "clothes_clothin.png"
        },
        {
            name: "other",
            display_name: "Featured products",
            icon_img: "others.png"
        }
    ];

    dm_prt_subcategories = {
        fruits_vegetables: [],
        dairy_break: [],
        household: [],
        kirana_goods: [],
        personal_care: [],
        ayurvedic: [],
        foods_snacks: [],
        offers: [],
        other: [],
        electronic_accessories: [],
        poojan_saamagri: [],
        clothes_apparel: []
    };

    dm_prt_products = [];

    
    var av = storage.getItem("version");
    if (av != cav) {
        var raw_prt_list = dm_crt_elt("prt_list");
        if (raw_prt_list) {
            var prts = raw_prt_list.split(",");
            for (var i = 0; i < prts.length; i++) {
                storage.removeItem("prt_" + prts[i]);
                storage.removeItem("min_" + prts[i]);
            }
        }
        
        dm_save("prt_list", "");
        dm_save("lastUpdate", 0);
        lastUpdate = 0;
        storage.setItem("version", cav);
    }

    dm_load();
    
}
var raw_prt_list;
function dm_load() {
    //hide_loadScreen();
    //return;

    dm_prt_products = {};
    raw_prt_list = dm_crt_elt("prt_list");
    if (!raw_prt_list) raw_prt_list = "";
    var prt_list = raw_prt_list ? raw_prt_list.split(",") : [];
    for (var i = 0; i < prt_list.length; i++) {
        if (prt_list[i]) {
            dm_prt_products[prt_list[i]] = JSON.parse(dm_crt_elt("prt_" + prt_list[i]));
        }
    }

    var lastUpdate = storage.getItem("lastUpdate");
    if(!lastUpdate) lastUpdate = 0;
    httpGetAsync(get_api_url("new", lastUpdate), dm_load_success, ls_loading_failed);
}
function dm_load_image(pid, callback) {
    if (dm_images_cache[pid]) {
        callback(dm_images_cache[pid], dm_desc_cache[pid]);
        return;
    }
    dm_img_load_success_callback = callback;
    dm_img_load_last_pid = pid;
    httpGetAsync(get_img_api_url(pid), dm_img_load_success);
}

function dm_load_success(response) {
    var resp;
    try {
        resp = JSON.parse(response);
    } catch (e) {
        ls_loading_failed();
        return;
    }
    if (resp.status == "OK") {
        if (dm_save_data(resp)) {
            ls_loading_failed();
            return;
        }
        storage.setItem("lastUpdate", resp.date);
        setTimeout(dm_update_rtd, 10000);
        hide_loadScreen();

        httpGetAsync(get_bans_api_url(), dm_bans_load_success, function () { console.log("Could not load more banners."); });

    } else {
        alert(response);
    }
}
var dm_img_load_success_callback;
var dm_img_load_last_pid;
function dm_img_load_success(response) {
    console.log();
    var resp = JSON.parse(response);
    if (resp.status == "OK") {
        dm_images_cache[dm_img_load_last_pid] = resp.data;
        dm_desc_cache[dm_img_load_last_pid] = resp.description;
        dm_img_load_success_callback(resp.data, resp.description);
    } else {
        console.log(response);
    }
}

function dm_bans_load_success(response) {
    try {
        var banners = JSON.parse(response);
        if (banners) dm_add_banners(banners);
        else console.log("Could not load more banners.");
    } catch (e) {
        console.log("Could not load more banners.");
    }
}

function dm_get_catByName(name) {
    for (var i = 0; i < dm_prt_categories.length; i++) {
        if (dm_prt_categories[i].name === name) return dm_prt_categories[i];
    }
}

function dm_get_product_min(pid) {
    var img_data = cache_crt_elt("min_" + pid);
    if (img_data) {
        return img_data;
    } else {
        return null;
    }
}


function dm_save_data(resp) {

    try {
        dm_prt_discounts = resp.discounts;
        var raw_prt_list = dm_crt_elt("prt_list");
        if (!raw_prt_list) raw_prt_list = "";
        for (var pid in resp.products) {
            if (resp.products.hasOwnProperty(pid)) {
                if (raw_prt_list.indexOf(pid + ",") == -1) raw_prt_list += pid + ",";
                dm_prt_products[pid] = resp.products[pid];
                dm_save("prt_" + pid, JSON.stringify(resp.products[pid]));
            }
        }
        dm_save("prt_list", raw_prt_list);

        for (var pid in resp.images) {
            if (resp.images.hasOwnProperty(pid)) {
                dm_save("min_" + pid, resp.images[pid].base64_data);
            }
        }

        var infos = resp["infos"];
        dm_company_info = infos["company"];
        dm_del_cost = parseFloat(infos["delivery_cost"]);
        dm_order_phone_num = infos["order_phone_num"];

        var banners = resp["banners"];
        dm_add_banners(banners);

        var subcats = resp["subcats"];

        if (subcats) {
            for (var i = 0; i < subcats.length; i++) {
                var cat = subcats[i].cat;
                var subs = subcats[i].subs.split(",");
                for (var j = 0; j < subs.length; j++) {
                    if (subs[j].length > 0) {
                        var raw_sub = subs[j].split(":");
                        var sub = { name: raw_sub[0], display_name: raw_sub[1] };
                        dm_prt_subcategories[cat].push(sub);
                    }
                }
            }
        }

        if (resp["msg"]) {
            alert(resp["msg"]);
        }

        if (resp["newversion"]) {
            navigator.notification.confirm(
                'There is a new version of the app, Please update it from Google Play.',
                new_ver_msg_answer,
                'New version available!',
                'Cancel,Update'
            );
        }
        return;
        var prts_to_del = resp["prts_to_del"];
        if (!prts_to_del) return;
        for (var i = 0; i < prts_to_del.length; i++) {
            storage.removeItem("prt_" + prts_to_del[i]);
            delete dm_prt_products[prts_to_del[i]];
        }
        return false;
    } catch (e) {
        return true;
    }

}

function new_ver_msg_answer(buttonIndex) {
    if (buttonIndex == 2) {
        cordova.InAppBrowser.open(app_play_url, '_system', 'location=yes');
    }
}

var first_banner = true;
function dm_add_banners(banners) {
    var mc_home_banners_con = get("mc_home_banners_con");
    for (var i = 0; i < banners.length; i++) {
        var banner = crt_elt("img");
        if (first_banner) {
            first_banner = false;
            banner.style.display = 'unset';
            banner.style.opacity = 1;
        }
        banner.src = banners[i].base64_data;
        banner.setAttribute("items", banners[i].items_group);
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

// --------------------------------

function dm_update_rtd() {
    if (checkTime == 0) checkTime = storage.getItem("lastUpdate");;
    httpGetAsync(get_rtpu_api_url(checkTime), dm_update_rtd_cb, dm_update_rtd_failed);
}
var dm_update_rtd_timer;
function dm_update_rtd_cb(response) {
    var resp = JSON.parse(response);
    checkTime = resp.time;
    pm_update_products(resp.items);
    clearTimeout(dm_update_rtd_timer);
    dm_update_rtd_timer = setTimeout(dm_update_rtd, 10000);
}

function dm_update_rtd_failed() {
    clearTimeout(dm_update_rtd_timer);
    dm_update_rtd_timer = setTimeout(dm_update_rtd, 10000);
}

function cache_set(name, value) {
    dm_cache[name] = value;
}
function cache_crt_elt(name) {
    return dm_cache[name];
}
function cache_del(name) {
    var isthere = dm_cache[name] ? true : false;
    if (isthere) delete dm_cache[name];
    return isthere;
}

// Low level System

function dm_save(key, data) {
    storage.setItem(key, data);
}

function dm_append(key, value) {
    var dslt = storage.getItem(key);
    if (dslt) storage.setItem(key, dslt + value);
    else storage.setItem(key, value);
}

function dm_crt_elt(key) {
    return storage.getItem(key);
}

function dm_del(key) {
    storage.removeItem(key);
}