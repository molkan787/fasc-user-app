var mc_cart_list;
var mc_cart_invoice_table;
var mc_cart_recap;
var mc_total;

var mc_cart_conshop;
var mc_cart_checkout;

var lastSavedAmount;

function mc_cart_init() {
    mc_cart_list = get("mc_cart_list");
    mc_cart_recap = get("mc_cart_recap");
    mc_cart_invoice_table = get("mc_cart_invoice_table");
    mc_cart_conshop = get("mc_cart_conshop");
    mc_cart_checkout = get("mc_cart_checkout");

    mc_cart_checkout.addEventListener("click", mc_cart_checkout_click);
    mc_cart_conshop.addEventListener("click", mc_cart_conshop_click);
    get("mc_cart_add_addr").onclick = function () { ui_navigate("add_addr") };
} 

function mc_cart_checkout_click() {
    if (this.innerText == "Next") {
        ui_navigate("cart_recap");
    } else {
        if (mc_total < 299) {
            alert("Minimum order value must be 299 ₹ to place an order.");
            return;
        }
        if (!mc_cart_daddr.value) {
            msg("There is no address added yet, Do you want to add it now?", function () { ui_navigate("add_addr") });
            return;
        } else {
            if (!mc_cart_ddate.value || !mc_cart_dhour.value) {
                alert("Please select delivery date & hours");
                return;
            }
            var mc_red = mc_redtosuia();
            if (mc_red) {
                mc_signinup_rtcaf = true;
                ui_navigate("sign_upin", mc_red);
            } else {
                cart_place_order();
            }
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
    
    if (products.length == 0) {
        mc_cart_list.appendChild(mc_utils_getHelt("Nothing to show here,\n Start by adding some products."));
    } else {
        prt_load_mins();
    }
}

function mc_cart_get_products() {
    var result_list = [];
    for (var pid in dm_prt_products) {
        if (dm_prt_products.hasOwnProperty(pid)) {
            if (mc_cart_isOnCart(pid)) {
                result_list.push(dm_prt_products[pid]);
            }
        }
    }
    return result_list;
}

function mc_cart_isOnCart(pid) {
    return (cart_items[pid]);
}

function mc_cart_load_recap() {
    mc_cart_cleanup();
    mc_cart_table_addrow("Item", "Prize", "Q", "Total", true);

    var total = dm_del_cost;
    var saved = 0;
    var cproducts = mc_cart_get_products()  ;
    for (var i = 0; i < cproducts.length; i++) {
        var cprt = cproducts[i];
        var count = cart_items[cprt.id].count;
        var discount = parseInt(cprt.discount);
        var iscd = discount > 1000;
        if (iscd) discount -= 1000;
        var aprize = parseFloat(cprt.prize);
        if (discount) {
            aprize = iscd ? aprize - discount : (aprize * (100 - discount) / 100);
        }
        var ltotal = aprize * count;
        var lsaved = (parseFloat(cprt.prize) - aprize) * count;

        mc_cart_table_addrow(cprt.display_name, aprize.toFixed(2), count, ltotal.toFixed(2), false);

        total += ltotal;
        saved += lsaved;
    }
    mc_total = total;

    lastSavedAmount = saved;

    mc_cart_table_addrow("", "", "", "", false);
    mc_cart_table_addrow("Delivery fees", "", "", dm_del_cost.toFixed(2), false);
    mc_cart_table_addrow("Total", "", "", total.toFixed(2), false);

    for (var i = 0; i < user.addresses.length; i++) {
        var addr = user.addresses[i];
        var option = crt_elt("option");
        option.innerText = addr.addr;
        option.setAttribute("name", addr.id);
        mc_cart_daddr.appendChild(option);
    }

    
    mc_cart_ddate.setAttribute("min", getDateStr());

}

function mc_cart_table_addrow(t1, t2, t3, t4, isfirst) {
    var tr = mc_cart_invoice_table.insertRow(mc_cart_invoice_table.rows.length);
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