var app_play_url = "https://play.google.com/store/apps/details?id=xyz.drmstudio.surjan";

//var api_url = "http://api.surjankirana.com/";
var api_url = "http://139.59.8.143/api/";
//var api_url = "http://localhost/api/";

function get_api_url(req, date){
    return api_url + "get_asd.php?req=" + req + "&date=" + date + "&cav="+cav;
}

function get_bans_api_url() {
    return api_url + "get_banners.php";
}

function get_rtpu_api_url(date) {
    return api_url + "get_rtpu.php?ctime=" + date;
}
function get_img_api_url(pid) {
    return api_url + "get_image.php?pid=" + pid;
}

function get_po_api_url() {
    return api_url + "place_order.php";
}

function get_mins_api_url(pids) {
    return api_url + "get_mins.php?pids=" + pids;
}


function get_ordman_api_url(req, token, oid) {
    return api_url + "orders_cs.php?req=" + req + "&token="  + token + "&oid=" + oid;
}

function get_cpn_api_url(client, token, num) {
    return api_url + "csui.php?req=changenum&client=" + client + "&token=" + token + "&num=" + num;
}

function get_gd_api_url(client, token) {
    return api_url + "csui.php?req=getdata&client="+client+"&token="+token;
}

function get_signup_api_url(num, first_name, last_name, email) {
    return api_url + "csui.php?req=register&num=" + num + "&first_name=" + first_name + "&last_name=" + last_name + "&email=" + email;
}

function get_login_api_url(num) {
    return api_url + "csui.php?req=login&num=" + num;
}

function get_auth_api_url(num, code) {
    return api_url + "csui.php?req=auth&num=" + num + "&code=" + code;
}