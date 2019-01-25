var mc_order;
var ord_data_con;
var loadOrderAction;
function mc_order_init() {
    mc_order = get('mc_order');
    ord_data_con = get('ord_data_con');

    registerPage('order', mc_order, function (param) {
        return txt('order') + ' #' + param;
    }, mc_order_update);

    loadOrderAction = fetchAction.create('orderadm/infoCS', loadOrderActionCallback);

}

function mc_order_update(param) {
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
    mc_cart_table_addrow(txt('total'), '', '', fasc.formatPrice(total, true), false, ord_items);

    mc_order.appendChild(ord_data_con);
}