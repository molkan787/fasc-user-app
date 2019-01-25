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
    var addr_id = mc_cart_daddr.value;
    var addr = user_get_addr(addr_id);
    var udp = {};
    var items = {};
    for (var item in cart_items) {
        items[item] = cart_items[item].count;
    }

    udp.del_date = get("mc_cart_ddate").value;
    udp.del_timing = val("mc_cart_dhour_fi");
    udp.products = JSON.stringify({ items: items });
    udp.address_1 = addr.address_1;
    udp.address_2 = addr.address_2;
    udp.city = addr.city;
    udp.pay_method = "cod";

    gl_show_wbp();
    orderAction.do(udp);
}

function orderActionCallback(action) {
    if (action.status == 'OK') {
        cart_empty();
        msg(txt('order_success'), null, 1);
        not_push(txt('order') + '#' + action.data.order_id, txt('order_success'));
        gl_hide_wbp();
        ui_navigate("order", action.data.order_id);
    } else {
        msg(txt('error_msg'), null, 1);
    }
    gl_hide_wbp();
}
