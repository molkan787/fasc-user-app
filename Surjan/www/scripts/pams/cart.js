var cart_items = {};
var cart_items_count = 0;

function cart_set_count(pid, count) {
    if (count == 0) {
        cart_remove(pid);
        return;
    }
    var item = cart_items[pid];
    if (item) {
        item.count = count;
    } else {
        item = {
            id: pid,
            count: count
        };
        cart_items_count++;
        cart_items[pid] = item;
        glui_update_cart_count(cart_items_count);
    }
}

function cart_empty() {
    cart_items = {};
    cart_items_count = 0;
    glui_update_cart_count(0);
}

function cart_remove(pid) {
    if (cart_items[pid]) {
        delete cart_items[pid];
        cart_items_count--;
        glui_update_cart_count(cart_items_count);
    }
}

function cart_get_count(pid) {
    var item = cart_items[pid];
    if (item) {
        return item.count;
    } else {
        return 0;
    }
}

function cart_place_order() {
    var udp = {};
    udp.items = cart_items;
    udp.client = client_id;
    udp.usertoken = client_token;

    udp.addr = get("mc_cart_daddr").value;
    udp.date = get("mc_cart_ddate").value;
    udp.hours = get("mc_cart_dhour").value;
    udp.pay_method = "cod";
    cart_send_por(udp);
}

function cart_send_por(udp) {
    gl_show_wbp();
    httpPostAsync(get_po_api_url(), JSON.stringify(udp), function (response) {
        //var resp = split(response, /:/g, 2);
        var resp = response.split(":");
        if (resp[0] == "OK") {
            udp.oid = resp[1];
            udp.total = resp[2];
            udp.order_time = new Date().getTime();
            udp.saved = lastSavedAmount;
            for (var pid in udp.items) {
                if (udp.items.hasOwnProperty(pid)) {
                    udp.items[pid].prize = pm_get_product_prize(pid);
                }
            }
            dm_save("order_" + resp[1], JSON.stringify(udp));
            dm_append("ord_list", resp[1] + ",");

            cart_empty();
            alert("Your order was successfully placed!");
            not_push("Order #" + resp[1], "Your order was successfully placed!");
            gl_hide_wbp();
            ui_navigate("orders", true);
        } else if (response == "TO_FAR") {
            alert("You are to far, We cant delivery to this address.");
        } else if (response == "OUT_OF_STOCK") {
            dm_update_rtd();
            alert("We could not place your order cause one or more of items are out of stock, Review your cart to check what was removed!");
            ui_navigate("cart");
        } else {
            //alert(response);
            alert("We could not place your order.");
        }
        gl_hide_wbp();
    });
}