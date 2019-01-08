var user;
function user_init() {
    user = {};
    var raw_addresses = storage.getItem("addresses");
    if (raw_addresses) {
        user.addresses = JSON.parse(raw_addresses);
    } else {
        user.addresses = [];
    }
}

function user_get_addr(addr_id) {
    for (var i = 0; i < user.addresses.length; i++) {
        var addr = user.addresses[i];
        if (addr.id == addr_id) {
            return addr;
        }
    }
}

function user_del_addr(addr_id) {
    for (var i = 0; i < user.addresses.length; i++) {
        if (user.addresses[i].id == addr_id) {
            user.addresses.splice(i, 1);
            save_addresses();
        }
    }
}

function user_add_addr(addr) {
    var addr = {
        id: genId(8),
        addr: addr
    };
    user.addresses.push(addr);
    save_addresses();
    return addr;
}

function save_addresses() {
    var end_addresses = JSON.stringify(user.addresses);
    storage.setItem("addresses", end_addresses);
}

function user_update_phonenumber(newnum) {

    gl_show_wbp();

    httpGetAsync(get_cpn_api_url(client_id, client_token, newnum), function (response) {
        if (response == "OK") {
            gl_allow_sui = true;
            new_phonenum = newnum;
            ui_navigate("sign_upin", "auth");
        } else {
            alert("We could not change you phone number.");
        }
        gl_hide_wbp();
    });

}