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

var new_phonenum;

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

    registerPage('supin_up', mc_supin_up, 'Register', function () {
        get('su_first_name').value = '';
        get('su_last_name').value = '';
        get('su_num').value = '';
        get('su_email').value = '';
    });
    registerPage('supin_in', mc_supin_in, 'Login', function () {
        get("si_num").value = client_num;
    });
    registerPage('supin_auth', mc_supin_auth, 'Verify', function () {
        get('auth_code').value = '';
    });
}

function account_load() {
    account_load_addresses();
    get("mc_account_name").innerText = client_first_name + " " + client_last_name;
    get("mc_account_phone").innerText = client_num;
}

function account_load_addresses() {
    var mc_account_addresses = get("mc_account_addresses");
    mc_account_addresses.innerHTML = "";
    for (var i = 0; i < user.addresses.length; i++) {
        var addr = user.addresses[i];
        mc_account_addresses.appendChild(account_createAddrPanel(addr));
    }
}

function account_addrs_del_click() {
    var addr_id = this.getAttribute("addr_id");
    var addr = user_get_addr(addr_id);
    msg("Are you sure you want to delete this address '" + addr.addr + "'", function () {
        account_delete_addr(addr_id);
    });
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
            alert("Invalid phone number.");
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
        alert("Please enter valid phone number in this format: 7004003000");
        return;
    }
    acc_set_num(su_num);
    var post_url = get_signup_api_url(su_num, su_first_name, su_last_name, su_email);
    gl_show_wbp("Registrating...");
    httpGetAsync(post_url, function (response) {
        if (response == "OK") {
            ui_navigate("sign_upin", "auth");
        } else if (response == "ERROR_NUM_REGISTERED"){
            alert("This phone number is already registered, Please login instead.");
        } else {
            alert("We could not register you.");
        }
        gl_hide_wbp();
    });

}

function mc_signin_btn_click() {
    var si_num = get("si_num").value;
    if (!(/^\d+$/.test(si_num) && si_num.length == 10)) {
        alert("Please enter valid phone number in this format: 7004003000");
        return;
    }
    var post_url = get_login_api_url(si_num);
    gl_show_wbp("Logging in...");
    httpGetAsync(post_url, function (response) {
        if (response == "OK") {
            acc_set_num(si_num);
            ui_navigate("sign_upin", "auth");
        } else if (response == "NO_CLIENT"){
            alert("You are not registered yet, please register first to login.");
        } else {
            alert("We could not request code for you.");
        }
        gl_hide_wbp();
    });
}
var mc_signinup_rtcaf = false;
function mc_signauth_btn_click() {
    var auth_code = get("auth_code").value;
    if (!(/^\d+$/.test(auth_code) && auth_code.length == 6)) {
        alert("Please enter valid 6 digits code.");
        return;
    }
    var post_url = get_auth_api_url(new_phonenum || client_num, auth_code);
    gl_show_wbp("Verifying...");
    httpGetAsync(post_url, function (response) {
        console.log(response);
        if (response.substr(0, 5) != "ERROR") {
            var resp = JSON.parse(response);
            var newnum = resp["newnum"];
            acc_set_token(resp["token"], resp["client"]);

            if (newnum) {
                acc_set_num(newnum);
                get("mc_account_phone").innerText = newnum;
                alert("Your phone number was successfully changed!");
            } else {
                alert("You have been logged in successfully!");
            }
            new_phonenum = null;
            if (mc_signinup_rtcaf) ui_navigate("cart_recap");
            else ui_goback();
        } else {
            alert("Incorrect Code!");
        }
        gl_hide_wbp();
    });
}

function mc_signup_ihac_click() {
    ui_navigate("supin_in");
}
function mc_signup_iwtr_click() {
    ui_navigate("supin_up");
}

function mc_redtosuia() {
    if (!client_token) {
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
    if (aadr_a1.length < 3 || aadr_pin.length < 3) {
        alert("Please enter valid address.");
        return;
    }
    var addr = aadr_a1 + ", " + aadr_a2 + " " + aadr_pin + " - " + aadr_city;

    account_addNewAddr(addr);
    ui_goback();
}

// UI

function account_createAddrPanel(addr) {
    var con = crt_elt("div");
    var text = crt_elt("span");
    var img = crt_elt("img");

    con.setAttribute("id", "acc_addr_" + addr.id);

    text.innerText = addr.addr;
    img.src = "images/gtk_close.png";
    img.setAttribute("addr_id", addr.id);
    img.addEventListener("click", account_addrs_del_click);

    con.appendChild(text);
    con.appendChild(img);

    return con;
}