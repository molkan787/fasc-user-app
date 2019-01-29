var mc_account;
var mc_supin_up;
var mc_supin_in;
var mc_supin_auth;

var mc_signup_btn;
var mc_signin_btn;
var mc_signauth_btn;
var mc_signup_ihac;
var mc_signup_iwtr;

var mc_add_addr;
var addr_a1;
var addr_a2;
var addr_city;
var addr_pin;
var mc_addr_btn;
var account = {
    addresses: []
};

var new_phonenum;
var client_logged = false;

var registerAction;
var loginAction;
var authAction;

var addAddrAction;
var delAddrAction;

var accountData;

function account_init() {
    mc_account = get("mc_account");
    mc_supin_up = get("mc_supin_up");
    mc_supin_in = get("mc_supin_in");
    mc_supin_auth = get("mc_supin_auth");
    mc_signup_ihac = get("mc_signup_ihac");
    mc_signup_iwtr = get("mc_signup_iwtr");

    mc_add_addr = get("mc_add_addr");
    addr_a1 = get("addr_a1");
    addr_a2 = get("addr_a2");
    addr_city = get("addr_city");
    addr_pin = get("addr_pin");
    mc_addr_btn = get("mc_addr_btn");

    mc_addr_btn.addEventListener("click", mc_addr_btn_click);

    mc_signup_btn = get("mc_signup_btn");
    mc_signin_btn = get("mc_signin_btn");
    mc_signauth_btn = get("mc_signauth_btn");

    mc_signup_btn.addEventListener("click", mc_signup_btn_click);
    mc_signin_btn.addEventListener("click", mc_signin_btn_click);
    mc_signauth_btn.addEventListener("click", mc_signauth_btn_click); 
    mc_signup_ihac.addEventListener("click", mc_signup_ihac_click);
    mc_signup_iwtr.addEventListener("click", mc_signup_iwtr_click);
    

    get("mc_account_add_addr").addEventListener("click", account_addNewAddrClick);
    get("mc_account_phone_edit").addEventListener("click", mc_account_phone_edit_click);

    registerPage('supin_up', mc_supin_up, txt('register'), function () {
        get('su_first_name').value = '';
        get('su_last_name').value = '';
        get('su_num').value = '';
        get('su_email').value = '';
    });
    registerPage('supin_in', mc_supin_in, txt('login'), function () {
        get("si_num").value = client_num;
    });
    registerPage('supin_auth', mc_supin_auth, txt('verify'), function () {
        get('auth_code').value = '';
    });

    registerAction = fetchAction.create('csc/register', registerActionCallback);
    loginAction = fetchAction.create('csc/login', loginActionCallback);
    authAction = fetchAction.create('csc/verify', authActionCallback);

    addAddrAction = fetchAction.create('address/add', addAddrActionCallback);
    delAddrAction = fetchAction.create('address/delete', delAddrActionCallback);
}

function setAccountData(data, addresses) {
    account.addresses = addresses;
    accountData = data;
    if (accountData && accountData.id) {
        client_logged = true;
    } else {
        client_logged = false;
    }
    lm_setLogoutOption(client_logged);
    window.localStorage.setItem('account_data', JSON.stringify(data));
    lm_update_account();
}

function addAddrActionCallback(action) {
    if (action.status == 'OK') {
        ui_goback();
        account_addNewAddr(action.data);
    } else {
        msg(txt('error_msg'), null, 1);
    }
    gl_hide_wbp();
}

function delAddrActionCallback(action) {
    if (action.status == 'OK') {
        account_delete_addr(action.params.addr_id);
    } else {
        msg(txt('error_msg'), null, 1);
    }
    gl_hide_wbp();
}

var reg_token;
var reg_phone;
function registerActionCallback(action) {
    if (action.status == 'OK') {
        goToAuthPage(action.data);
    } else if (action.error_code = 'phone_exist') {
        msg(txt('phone_already_registrated'), null, 1);
    } else {
        msg(txt('registration_error'), null, 1);
    }
    gl_hide_wbp();
}

function loginActionCallback(action) {
    if (action.status == 'OK') {
        goToAuthPage(action.data);
    } else if (action.error_code = 'customer_not_found') {
        msg(txt('not_registrated'), null, 1);
    } else {
        msg(txt('error_msg'), null, 1);
    }
    gl_hide_wbp();
}

function authActionCallback(action) {
    if (action.status == 'OK') {
        setAccountData(action.data.data, action.data.addresses);
        msg(txt('login_success'), function () {
            reAsd();
            ui_navigate('home');
        }, 1);
        
    } else if (action.error_code == 'invalid_code') {
        msg(txt('wrong_auth_code'), null, 1);
    } else {
        msg(txt('error_msg'), null, 1);
    }
    gl_hide_wbp();
}

function goToAuthPage(data) {
    reg_token = data.token;
    reg_phone = data.telephone;
    ui_navigate('supin_auth');
}

function confirmLogout() {
    msg(txt('confirm_logout'), account_logout);
}

function account_logout() {
    setAccountData(null, null);
    dm.setSessionId('');
    reAsd(true);
}

function account_load() {
    account_load_addresses();
    get("mc_account_name").innerText = accountData.firstname + " " + accountData.lastname;
    get("mc_account_phone").innerText = client_num;
}

function account_load_addresses() {
    var mc_account_addresses = get("mc_account_addresses");
    mc_account_addresses.innerHTML = '';
    for (var i = 0; i < account.addresses.length; i++) {
        var addr = account.addresses[i];
        mc_account_addresses.appendChild(account_createAddrPanel(addr));
    }
}

function account_addrs_del_click() {
    var addr_id = this.getAttribute("addr_id");
    var addr = user_get_addr(addr_id);
    var addr_txt = addr.address_1 + ', ' + addr.address_2 + ' ' + addr.city;
    msg(txt('confirm_addr_delete', addr_txt), function () {
        setTimeout(function () {
            gl_show_wbp();
            delAddrAction.do({ addr_id: addr_id });
        }, 500);
    }, function () { });
}

function account_delete_addr(addr_id) {
    user_del_addr(addr_id);
    var mc_account_addresses = get("mc_account_addresses");
    var addr_pan = get("acc_addr_" + addr_id);
    mc_account_addresses.removeChild(addr_pan);
}

function account_addNewAddrClick() {
    ui_navigate("add_addr");
}

function account_addNewAddr(addr) {
    var addr = user_add_addr(addr);
    mc_account_addresses.appendChild(account_createAddrPanel(addr));
}

function mc_account_phone_edit_click() {
    get("account_edit_phonenumber_input").value = client_num;
    popup(account_edit_phonenumber, function () {
        var phoneNumber = get("account_edit_phonenumber_input").value;
        if (isNaN(phoneNumber) || phoneNumber.length != 10) {
            msg(txt('invalid_phone_number'), null, 1);
            return;
        } else if (phoneNumber == client_num) {
            return;
        }
        user_update_phonenumber(phoneNumber);

    });
}

function mc_signup_btn_click() {
    var su_first_name = get("su_first_name").value;
    var su_last_name = get("su_last_name").value;
    var su_num = get("su_num").value;
    var su_email = get("su_email").value;
    if (!(/^\d+$/.test(su_num) && su_num.length == 10)) {
        msg(txt('invalid_phone_number'), null, 1);
        return;
    }
    acc_set_num(su_num);
    gl_show_wbp();
    registerAction.do({
        firstname: su_first_name,
        lastname: su_last_name,
        telephone: su_num,
        email: su_email
    });

}

function mc_signin_btn_click() {
    var si_num = get("si_num").value;
    if (!(/^\d+$/.test(si_num) && si_num.length == 10)) {
        msg(txt('invalid_phone_number'), null, 1);
        return;
    }
    var post_url = get_login_api_url(si_num);
    gl_show_wbp();
    acc_set_num(si_num);
    loginAction.do({
        telephone: si_num
    });
}
var mc_signinup_rtcaf = false;
function mc_signauth_btn_click() {
    var auth_code = get("auth_code").value;
    if (!(/^\d+$/.test(auth_code) && auth_code.length == 6)) {
        msg(txt('enter_valid_code'), null, 1);
        return;
    }

    gl_show_wbp();
    authAction.do({
        telephone: reg_phone,
        token: reg_token,
        code: auth_code
    });
}

function mc_signup_ihac_click() {
    ui_navigate("supin_in");
}
function mc_signup_iwtr_click() {
    ui_navigate("supin_up");
}

function mc_redtosuia() {
    if (!client_logged) {
        if (client_num) {
            return "supin_in"
        } else {
            return "supin_up";
        }
    } else {
        return null;
    }
}

function mc_addr_btn_click() {
    var aadr_a1 = addr_a1.value;
    var aadr_a2 = addr_a2.value;
    var aadr_city = addr_city.value;
    var aadr_pin = addr_pin.value;
    if (aadr_a1.length < 3) {
        alert("Please enter valid address.");
        return;
    }
    var data = {
        address_1: aadr_a1,
        address_2: aadr_a2,
        city: aadr_city,
        postcode: aadr_pin
    };

    gl_show_wbp();
    addAddrAction.do(data);
    
}

// UI

function account_createAddrPanel(addr) {
    var con = crt_elt("div");
    var text = crt_elt("span");
    var img = crt_elt("img");

    con.setAttribute("id", "acc_addr_" + addr.address_id);

    addr_html = addr.address_1 + ', ' + addr.address_2 + '<br />';
    addr_html += addr.city;
    text.innerHTML = addr_html;
    img.src = "images/gtk_close.png";
    img.setAttribute("addr_id", addr.address_id);
    img.addEventListener("click", account_addrs_del_click);

    con.appendChild(text);
    con.appendChild(img);

    return con;
}