var mc_orders;
var inv_elt;

var listOrdersAction;
function mc_orders_init() {
    mc_orders = get("mc_orders");
    inv_elt = get("invoice");

    listOrdersAction = fetchAction.create('orderadm/listCS', listOrdersActionCallback);
}

function listOrdersActionCallback(action) {
    mc_orders.innerHTML = '';
    if (action.status == 'OK') {
        var orders = action.data.items;
        if (orders.length == 0) {
            setPlaceHolderIcon('cart', txt('no_orders'), mc_orders);
        } else {
            for (var i = 0; i < orders.length; i++) {
                var pan = mc_orders_createOrderPanel(orders[i]);
                mc_orders.appendChild(pan);
            }
        }

    } else {
        setPlaceHolderIcon('cart', txt('no_orders'), mc_orders);
    }
}

function mc_orders_load() {
    setDimmer(mc_orders, true);
    listOrdersAction.do();
}

function mc_orders_createOrderPanel(data) {
    var div = crt_elt('div');
    var h4 = crt_elt('h4', div);
    var t_h4 = crt_elt('h4', div);
    var s_h4 = crt_elt('h4', div);
    var s_img = crt_elt('img', s_h4);
    var s_label = crt_elt('label', s_h4);

    div.className = 'order_item';
    val(h4, txt('order_date') + ': ' + data.date_added);
    var od_span = crt_elt('span', h4);
    val(od_span, txt('order') + ' #' + data.order_id);
    s_img.src = getOrderStatusIcon(data.order_status_id);
    val(s_label, txt('status_' + data.order_status_id));
    s_h4.style.color = getOrderStatusColor(data.order_status_id);
    val(t_h4, txt('order_total') + ': ' + fasc.formatPrice(data.total));

    attr(div, 'order_id', data.order_id);
    div.onclick = orderPanelClick;

    return div;
}

function getOrderStatusIcon(status_id) {
    if (status_id == 1) {
        return 'images/icons/clock.png';
    } else if (status_id == 5) {
        return 'images/icons/checked.png';
    } else if (status_id == 7) {
        return 'images/icons/close_red.png';
    }else{
        return '';
    }
}

function getOrderStatusColor(status_id) {
    if (status_id == 1) {
        return '#F36F24';
    } else if (status_id == 5) {
        return '#49B747';
    } else if (status_id == 7) {
        return '#F44336';
    } else {
        return '';
    }
}

function orderPanelClick() {
    ui_navigate('order', attr(this, 'order_id'));
}

function mc_ord_createTableRow(td1, td2, td3, isheader) {
    var _tr = crt_elt("tr");
    var _td1 = crt_elt("td");
    var _td2 = crt_elt("td");
    var _td3 = crt_elt("td");

    _td1.innerText = td1;
    _td2.innerText = td2;
    _td3.innerHTML = isNaN(td3) ? td3 : td3.toFixed(2) + "&#8377";

    _td2.style.width = "8vw";
    _td2.style.textAlign = "center";
    _td3.style.width = "16vw";
    _td3.style.textAlign = isheader ? "center" : "right";

    if (isheader) _tr.className = "mord_pan_t_tr mord_pan_t_tr_hdr";
    else _tr.className = "mord_pan_t_tr";
    _tr.appendChild(_td1);
    _tr.appendChild(_td2);
    _tr.appendChild(_td3);
    return _tr;
}

function mc_ord_download_invoice() {
    var oid = this.getAttribute("oid");
    create_invoice(oid);
}

function mc_ord_cancel_order() {
    var oid = this.getAttribute("oid");
    msg("Are you sure you want to cancel order #" + oid + "?", function () {
        gl_show_wbp();
        httpGetAsync(get_ordman_api_url("cancel", client_token, oid), function (response) {
            if (response == "OK") {
                alert("Your order was successfully canceled.");
                mc_orders_cancelOrderPanel(oid);
            } else if (response == "TO_LATE"){
                alert("Your order has been prepared and cannot be canceled anymore.");
            } else {
                alert("We could not cancel your order.");
                console.log(response)
            }
            gl_hide_wbp();
        });
    });
}

function create_invoice(oid) {
    gl_show_wbp("Downloading...");
    //console.log(get_ordman_api_url("get_invoice", client_token, oid));
    httpGetAsync(get_ordman_api_url("get_invoice", client_token, oid), function (response) {
        if (response.substr(0, 1) != "{") {
            gl_hide_wbp();
            mc_ord_showerrormsg(99);
            return;
        }
        var inv = JSON.parse(response);
        var oid = inv.id;
        var ord = JSON.parse(dm_crt_elt("order_" + oid));
        var order_date = timestampToDate(inv.order_date);
        var client = client_first_name + " " + client_last_name;
        var _tmp = inv.del_date.split("-");
        var del_date = _tmp[2] + "/" + _tmp[1] + "/" + _tmp[0];

        ord_prepare_invoice(client, client_num, inv.del_addr, oid, order_date, inv.del_hours + " " + del_date, inv.total, ord.saved || "-", inv.items);
        ord_makePDF(oid);
    }, function () {
        gl_hide_wbp();
        mc_ord_showerrormsg(100);
    });
    //var raw_inv = '{"id":"76","client":"29","order_date":"1538460651","del_addr":"Rue de la fortess 4, 5555 - Pipariya","del_hours":"3 PM - 8 PM","del_date":"2018-10-11","total":"2160","items":[{"pid":"13","amount":4,"prize":520}]}';
    
}

function ord_prepare_invoice(client, phone, addr, oid, orderdate, del_time, total, saved, items) {
    get("inv_client").innerText = client;
    get("inv_phone").innerText = phone;
    get("inv_addr").innerText = addr;
    get("inv_oid").innerText = oid;
    get("inv_orderdate").innerText = orderdate;
    get("inv_del_time").innerText = del_time;
    get("inv_total").innerText = parseFloat(total).toFixed(2);
    get("inv_saved").innerText = isNaN(saved) ? saved : parseFloat(saved).toFixed(2);


    var tbl = get("inv_dw_table").getElementsByTagName("tbody")[0];
    tbl.innerHTML = "";
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var tr = crt_elt("tr");
        var td1 = crt_elt("td");
        var td2 = crt_elt("td");
        var td3 = crt_elt("td");
        var td4 = crt_elt("td");
        var prt = pm_get_product(item.pid) || {};
        td1.innerText = prt.display_name || "---";
        td2.innerText = item.amount;
        td3.innerHTML = parseFloat(item.prize).toFixed(2) + "&#8377";
        td4.innerHTML = (parseInt(item.amount) * parseFloat(item.prize)).toFixed(2) + "&#8377";

        td2.style.textAlign = "center";
        td3.style.textAlign = td4.style.textAlign = "right";
        td3.style.paddingRight = td4.style.paddingRight = "5px";

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tbl.appendChild(tr);
    }
}

function ord_makePDF(oid) {
    var fileName = "Invoice " + oid + ".pdf";

    var options = {
        documentSize: 'A4',
        type: 'base64'
    };

    var pdfhtml = '<html><body style="font-size:120%">' + inv_elt.innerHTML + '</body></html>';

    try {
        pdf.fromData(pdfhtml, options)
            .then(function (base64) {
                var contentType = "application/pdf";

                var folderpath = cordova.file.externalRootDirectory + "Download/";
                //downloadFile(base64, "invoice.pdf");
                savebase64AsPDF(folderpath, fileName, base64, contentType);
                setTimeout(function () {
                    gl_hide_wbp();
                    console.log(folderpath + fileName);
                    msg("Invoice was successfully downloaded, Do you want to open it?", function () {
                        var filepath = folderpath + fileName;
                        if (parseFloat(device.version) >= 7) filepath = filepath.replace("file://", "content://");
                        cordova.InAppBrowser.open(filepath, '_system', 'location=yes');
                    });
                }, 1000);
            })
            .catch(function (err) {
                console.log(err);
                gl_hide_wbp();
                mc_ord_showerrormsg(101);
            });
    } catch (e) {
        console.log(e);
        gl_hide_wbp();
        mc_ord_showerrormsg(104);
    }
}

function mc_ord_showerrormsg(errorcode) {
    alert("We could not download the invoice.\nError code:"+errorcode);
}