﻿var mc_cart_list;
var mc_cart_invoice_table;
var mc_cart_recap;
var mc_total;

var mc_cart_conshop;
var mc_cart_checkout;

var lastSavedAmount;

var orderAction;

function mc_cart_init() {
    mc_cart_list = get("mc_cart_list");
    mc_cart_recap = get("mc_cart_recap");
    mc_cart_invoice_table = get("mc_cart_invoice_table");
    mc_cart_conshop = get("mc_cart_conshop");
    mc_cart_checkout = get("mc_cart_checkout");

    mc_cart_checkout.addEventListener("click", mc_cart_checkout_click);
    mc_cart_conshop.addEventListener("click", mc_cart_conshop_click);
    get("mc_cart_add_addr").onclick = function () { ui_navigate("add_addr") };
    get('mc_checkout_back').onclick = ui_goback;
    get('mc_checkout_checkout').onclick = mc_cart_checkout_click;

    registerPage('cart', get('mc_cart'), 'Cart', mc_cart_load);
    registerPage('checkout', mc_cart_recap, 'Checkout', mc_cart_load_recap);

    orderAction = fetchAction.create('pos/addOrderCS', orderActionCallback);
} 

function mc_cart_checkout_click() {
    if (this.innerText == txt('next')) {
        ui_navigate("checkout");
    } else {
        var mc_red = mc_redtosuia();
        if (mc_red) {
            mc_signinup_rtcaf = true;
            ui_navigate("sign_upin", mc_red);
        }
        var min_total = parseInt(dm.bsd.min_total);
        if (mc_total < min_total) {
            alert(txt('min_order_value', min_total));
            return;
        }
        if (!mc_cart_daddr.value) {
            msg(txt('do_you_want_add_address'), function () { ui_navigate("add_addr") });
            return;
        } else {
            if (!mc_cart_ddate.value || !mc_cart_dhour.value) {
                msg(txt('select_del_date_hour'), null, 1);
                return;
            }
            cart_place_order();
        }
    }
}
function mc_cart_conshop_click() {
    ui_goback();
}

function mc_cart_load() {
    mc_cart_list.innerHTML = "";
    var products = mc_cart_get_products();
    for (var i = 0; i < products.length; i++) {
        var product_panel = mc_prt_ui_createProductPanel(products[i]);
        mc_cart_list.appendChild(product_panel);
        product_panel.addEventListener("click", mc_prt_product_click);
    }

    var spacer = crt_elt('div', mc_cart_list);
    spacer.style.height = '70px';

    if (products.length == 0) {
        setPlaceHolderIcon('cart', txt('cart_is_empty'), mc_cart_list);
    }
}

function mc_cart_get_products() {
    var result_list = [];
    for (var i = 0; i < cart_items.length; i++) {
        result_list.push(pm_get_product(cart_items[i]));
    }
    for (var pid in cart_items) {
        if (cart_items.hasOwnProperty(pid)) {
            result_list.push(pm_get_product(pid));
        }
    }
    return result_list;
}

function mc_cart_isOnCart(pid) {
    return (cart_items[pid]);
}

function mc_cart_load_recap() {
    mc_cart_cleanup();
    mc_cart_table_addrow(txt('item'), txt('price'), txt('q'), txt('total'), true);

    var del_timing = dm.bsd.timing_from + ' to ' + dm.bsd.timing_to;
    var mc_cart_dhour_fi = get('mc_cart_dhour_fi');
    val(mc_cart_dhour_fi, del_timing);
    mc_cart_dhour_fi.value = del_timing;

    var total = 0;//dm_del_cost;
    var saved = 0;
    var cproducts = mc_cart_get_products()  ;
    for (var i = 0; i < cproducts.length; i++) {
        var cprt = cproducts[i];
        var count = cart_items[cprt.product_id].count;
        var discount = parseInt(cprt.discount_amt);
        var iscd = (cprt.discount_type != 1);
        var aprize = parseFloat(cprt.price);
        if (discount) {
            aprize = iscd ? aprize - discount : (aprize * (100 - discount) / 100);
        }
        var ltotal = aprize * count;
        var lsaved = (parseFloat(cprt.price) - aprize) * count;

        mc_cart_table_addrow(cprt.title, aprize.toFixed(2), count, ltotal.toFixed(2), false);

        total += ltotal;
        saved += lsaved;
    }
    mc_total = total;

    lastSavedAmount = saved;

    mc_cart_table_addrow("", "", "", "", false);
    mc_cart_table_addrow(txt('del_fees'), "", "", 0, false);
    mc_cart_table_addrow(txt('total'), "", "", total.toFixed(2), false);

    for (var i = 0; i < account.addresses.length; i++) {
        var addr = account.addresses[i];
        if (addr.city != dm.city_names[1] && addr.city != dm.city_names[2]) continue;
        var option = crt_elt("option");
        option.innerText = addr.address_1 + (addr.address_2 == '' ? '' : ', ' + addr.address_2) + ', ' + addr.city;
        option.setAttribute("value", addr.address_id);
        mc_cart_daddr.appendChild(option);
    }

    
    mc_cart_ddate.setAttribute("min", getDateStr());

}

function mc_cart_table_addrow(t1, t2, t3, t4, isfirst, parent) {
    var elt = parent ? parent : mc_cart_invoice_table;
    var tr = elt.insertRow(elt.rows.length);
    var td1 = crt_elt("td");
    var td2 = crt_elt("td");
    var td3 = crt_elt("td");
    var td4 = crt_elt("td");
    if (isfirst) tr.className = "mc_cart_invoice_tfr";
    td1.innerText = t1;
    td2.innerText = t2;
    td3.innerText = t3;
    td4.innerText = t4;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
}

function mc_cart_cleanup() {
    while (mc_cart_invoice_table.rows.length) {
        mc_cart_invoice_table.deleteRow(0);
    }
    while (mc_cart_daddr.children.length) {
        mc_cart_daddr.removeChild(mc_cart_daddr.children[0]);
    }
}