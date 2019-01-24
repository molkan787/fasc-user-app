var mc_orders;
var inv_elt;
function mc_orders_init() {
    mc_orders = get("mc_orders");
    inv_elt = get("invoice");
}

function mc_orders_load(openfirst) {
    mc_orders.innerHTML = "";
    var orders = '';
    var alado = false;
    if (orders) {
        orders = orders.split(",");
        for (var i = orders.length-1; i >= 0; i--) {
            var order = dm_crt_elt("order_" + orders[i]);
            if (!order) continue;
            alado = true;
            var pan = mc_orders_createOrderPanel(order);
            mc_orders.appendChild(pan);
        }
    }
    if (!alado) setPlaceHolderIcon('cart', txt('no_orders'), mc_orders);
    else if (openfirst) mc_orders.children[0].click();
}

function mc_orders_createOrderPanel(raw_order) {
    var order = JSON.parse(raw_order);
    var is_canceled = order.is_canceled;
    var can_cancel = order.order_time + 7100000 > new Date().getTime();

    var _con = crt_elt("div");
    var _img = crt_elt("img");
    var _h1 = crt_elt("h1");
    var _span1 = crt_elt("span");
    var _span2 = crt_elt("span");

    var _btn_dwinv = crt_elt("button");
    var _btn_cancel = crt_elt("button");

    var _table_holder = crt_elt("div");
    var _table = crt_elt("table");

    _btn_dwinv.innerText = "Download invoice";
    _btn_cancel.innerText = "Cancel order";

    _btn_dwinv.addEventListener("click", mc_ord_download_invoice);
    _btn_cancel.addEventListener("click", mc_ord_cancel_order);

    _btn_dwinv.className = "mord_pan_btn";
    _btn_cancel.className = "mord_pan_btn";

    if (!can_cancel) _btn_dwinv.style.width = "100%";

    _btn_dwinv.setAttribute("oid", order.oid);
    _btn_cancel.setAttribute("oid", order.oid);

    _btn_dwinv.id = "ord_db_" + order.oid;
    _btn_cancel.id = "ord_cb_" + order.oid;

    _h1.innerText = "Order #" + order.oid;
    if (is_canceled) _h1.innerHTML = ' <span style="color: red;font-weight: normal;">' + _h1.innerText + ' Canceled</span>';
    _span1.innerHTML = "Total: <span class='mord_pan_hgtd'>" + parseFloat(order.total).toFixed(2) + "&#x20b9;</span>";
    _span2.innerText = "Delivery date: " + order.date;
    _img.src = "images/down_arrow.png";
    _img.id = "ord_tgli_" + order.oid;

    _table_holder.id = "ord_th_" + order.oid;
    _table_holder.setAttribute("oid", order.oid);
    _con.setAttribute("oid", order.oid);
    _con.id = "ordp_" + order.oid;
    _con.addEventListener("click", mc_orders_ord_th_click);

    _con.className = "mord_pan";
    _con.appendChild(_img);
    _con.appendChild(_h1);
    _con.appendChild(_span1);
    _con.appendChild(crt_elt("br"));
    _con.appendChild(_span2);
    _con.appendChild(_table_holder);
    _table_holder.appendChild(_table);
    if (!is_canceled) _table_holder.appendChild(_btn_dwinv);
    if (can_cancel && !is_canceled) _table_holder.appendChild(_btn_cancel);

    _table.appendChild(mc_ord_createTableRow("Item", "Q", "Prize", true));

    for (var key in order.items) {
        if (order.items.hasOwnProperty(key)) {
            var prt = pm_get_product(key);
            if (!prt) continue;
            _table.appendChild(mc_ord_createTableRow(prt.display_name, order.items[key].count, order.items[key].prize || "-"));
        }
    }
    

    return _con;
}

function mc_orders_cancelOrderPanel(oid) {
    var pan = get("ordp_" + oid);
    var h1 = pan.getElementsByTagName("h1")[0];
    h1.innerHTML = ' <span style="color: red;font-weight: normal;">' + h1.innerText + ' Canceled</span>';
    var btns = pan.getElementsByTagName("button");
    for (var i = 0; i < btns.length; i++){
        btns[i].style.display = "none"; 
    }
    var ord_data = dm_crt_elt("order_" + oid);
    if (ord_data) ord_data = JSON.parse(ord_data);
    if (ord_data) {
        ord_data.is_canceled = true;
        dm_save("order_" + oid, JSON.stringify(ord_data));
    }
}

var ord_lastTh;
function mc_orders_ord_th_click(e) {
    if (e.srcElement.tagName == "BUTTON") return;
    var oid = this.getAttribute("oid");
    var ord_th = get("ord_th_" + oid);
    if (ord_lastTh == ord_th) {
        if (ord_th.style.height == "inherit") mc_ord_setStat(oid, false);
        else mc_ord_setStat(oid, true);
    } else {
        if (ord_lastTh) mc_ord_setStat(ord_lastTh.getAttribute("oid"), false);
        mc_ord_setStat(oid, true);
    }
    ord_lastTh = ord_th;
}

function mc_ord_setStat(oid, stat) {
    var ord_th = get("ord_th_" + oid);
    var ord_ti = get("ord_tgli_" + oid);
    if (!ord_th) return;
    ord_th.style.height = stat ? "inherit" : "0";
    ord_ti.src = stat ? "images/up_arrow.png" : "images/down_arrow.png";
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