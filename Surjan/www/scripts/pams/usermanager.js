var user;
function user_init() {
    user = {};
    var raw_addresses = storage.getItem("addresses");
    if (raw_addresses) {
        try {
            account.addresses = JSON.parse(raw_addresses);
        } catch (ex) {
            account.addresses = [];
        }
    } else {
        account.addresses = [];
    }
}

function user_get_addr(addr_id) {
    for (var i = 0; i < account.addresses.length; i++) {
        var addr = account.addresses[i];
        if (addr.address_id == addr_id) {
            return addr;
        }
    }
}

function user_del_addr(addr_id) {
    for (var i = 0; i < account.addresses.length; i++) {
        if (account.addresses[i].address_id == addr_id) {
            account.addresses.splice(i, 1);
            save_addresses();
        }
    }
}

function user_add_addr(addr) {
    account.addresses.push(addr);
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