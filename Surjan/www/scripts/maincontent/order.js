﻿var mc_order;
var ord_data_con;
var loadOrderAction;
var cancelOrderAction;
var currentOrder;
function mc_order_init() {
    mc_order = get('mc_order');
    ord_data_con = get('ord_data_con');

    registerPage('order', mc_order, function (param) {
        return txt('order') + ' #' + param;
    }, mc_order_update);

    loadOrderAction = fetchAction.create('orderadm/infoCS', loadOrderActionCallback);
    cancelOrderAction = fetchAction.create('orderadm/cancel', cancelOrderActionCallback);

    get('order_cancel_btn').onclick = cancelOrderBtn_click;
    get('order_inv_btn').onclick = downloadInvoiceBtn_click;

}

function mc_order_update(param) {
    currentOrder = param;
    get('elts_holder').appendChild(ord_data_con);
    setDimmer(mc_order, true);
    loadOrderAction.do({order_id: param});
}

function loadOrderActionCallback(action) {
    if (action.status == 'OK') {
        mc_order.innerHTML = '';
        loadOrderData(action.data);
    } else {
        mc_order.innerHTML = '';
        setPlaceHolderIcon('box', txt('nothing_to_show'), mc_order);
        msg(txt('error_msg'), null, 1);
    }
}

function ord_cancel_order() {
    setTimeout(function () {
        gl_show_wbp();
        cancelOrderAction.do({ order_id: currentOrder });
    }, 300);
}

function cancelOrderActionCallback(action) {
    gl_hide_wbp();
    setTimeout(function () {
        if (action.status == 'OK') {
            msg(txt('cancel_order_success'), function () {
                ui_goback(true);
            }, 1);

        } else if (action.error_code == 'too_late') {
            msg(txt('cancel_order_too_late'), null, 1);
        } else {
            msg(txt('error_msg'), null, 1);
        }
    }, 400);
}

function loadOrderData(data) {
    var addr = data.shipping_address_1 + (data.shipping_address_2 == '' ? '' : ', ' + data.shipping_address_2);
    addr += ' - ' + data.shipping_city;
    val('ord_order_date', txt('order_date') + ': ' + data.date_added);
    val('ord_order_id', txt('order') + ': #' + data.order_id);
    val('ord_total', txt('order_total') + ': ' + fasc.formatPrice(data.total));
    get('ord_status_con').style.color = getOrderStatusColor(data.order_status_id);
    val('ord_status_icon', getOrderStatusIcon(data.order_status_id));
    val('ord_status_text', txt('status_' + data.order_status_id));
    val('ord_del_date', txt('delivery_date') + ': ' + data.del_date);
    val('ord_del_timing', txt('delivery_timing') + ': ' + data.del_timing);
    val('ord_del_addr', txt('delivery_address') + ':<br />- ' + addr);

    get('order_cancel_btn').style.display = (data.can_cancel && data.order_status_id == 1) ? 'unset' : 'none';

    var ord_items = get('ord_items');
    ord_items.getElementsByTagName('tbody')[0].innerHTML = '';

    var total = 0;
    var items = data.items;
    mc_cart_table_addrow(txt('item'), txt('price'), txt('q'), txt('total'), true, ord_items);
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var ltotal = parseFloat(item.price) * parseInt(item.quantity);
        total += ltotal;
        var ltotal_f = fasc.formatPrice(ltotal, true);
        mc_cart_table_addrow(item.name, fasc.formatPrice(item.price, true), item.quantity, ltotal_f, false, ord_items);
    }
    mc_cart_table_addrow(txt('del_fees'), '', '', fasc.formatPrice(parseFloat(data.total) - total, true), false, ord_items);
    mc_cart_table_addrow(txt('total'), '', '', fasc.formatPrice(data.total, true), false, ord_items);

    mc_order.appendChild(ord_data_con);
}

function cancelOrderBtn_click() {
    msg(txt('confirm_order_cancel'), ord_cancel_order);
}

function downloadInvoiceBtn_click() {
    var download_url = dm._getApiUrl('invoice', { order_id: currentOrder });
    cordova.InAppBrowser.open(download_url, '_system', 'location=yes');
}