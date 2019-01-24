var mc_notification;

var not_list = [];
var not_count = 0;
function mc_notification_init() {
    mc_notification = get("mc_notification");
    mc_notification_load();
    not_count = not_list.length;
    glui_update_not_count();
}

function not_push(title, msg) {
    var not = {
        title: title,
        msg: msg
    };
    not_list.push(not);
    not_count++;
    glui_update_not_count();
}

function mc_notification_load() {
    mc_notification.innerHTML = "";
    for (var i = not_list.length-1; i >= 0; i--) {
        if (not_list[i]) {
            var not_pan = mc_not_createNotPanel(not_list[i], i);
            mc_notification.appendChild(not_pan);
        }
    }
    if (not_list.length == 0) {
        setPlaceHolderIcon('bell', txt('no_notification'), mc_notification);
    }
}

function mc_not_createNotPanel(not, i) {
    var not_con = crt_elt("div");
    var not_img = crt_elt("img");
    var not_span = crt_elt("span");
    var not_br = crt_elt("br");
    var not_lbl = crt_elt("label");

    not_con.appendChild(not_img);
    not_con.appendChild(not_span);
    not_con.appendChild(not_br);
    not_con.appendChild(not_lbl);

    not_img.src = "images/gtk_close_g.png";
    not_img.setAttribute("not_id", i);
    not_img.addEventListener("click", mc_not_del_not);

    not_span.innerText = not.title;
    not_lbl.innerText = not.msg;

    not_con.className = "mc_not_row";
    not_con.setAttribute("id", "not_con_"+i);
    return not_con;
}

function mc_not_del_not() {
    var not_id = this.getAttribute("not_id");
    if (not_id == "null") return;
    this.setAttribute("not_id", "null");
    not_count--;
    not_list.splice(not_id, 1);
    glui_update_not_count();
    anime({
        targets: "#not_con_" + not_id, easing: 'easeOutExpo', padding: 0, height: 0, opacity: 0, duration: 500, complete: function () {
            mc_notification.removeChild(get("not_con_" + not_id));
        }
    });
}