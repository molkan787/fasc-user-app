var mc_search;
var mc_search_list;
var mc_search_tb;
var mc_search_sb;

var gl_rec_ava = false;

function mc_search_init() {
    mc_search = get("mc_search");
    mc_search_list = get("mc_search_list");
    mc_search_sb = get("mc_search_sb");
    mc_search_tb = get("mc_search_tb");
    mc_search_tb.addEventListener("input", mc_search_tb_change);
    mc_search_tb.addEventListener("focusout", mc_search_tb_focusout);
    mc_search_sb.addEventListener("click", mc_search_sb_click);

    if (window.plugins && window.plugins.speechRecognition){
        window.plugins.speechRecognition.isRecognitionAvailable(
            function (isav) {
                gl_rec_ava = isav;
                if (gl_rec_ava) mc_search_sb.src = "images/microphone.png";
            }, function () { gl_rec_ava = false; });
    }
    //gl_rec_ava = true;
    

}

function mc_search_load() {
    mc_cart_list.innerHTML = "";
    var products = mc_cart_get_products();
    for (var i = 0; i < products.length; i++) {
        var product_panel = mc_prt_ui_createProductPanel(products[i]);
        mc_cart_list.appendChild(product_panel);
        product_panel.addEventListener("click", mc_prt_product_click);
    }
    if (products.length == 0) {
        mc_cart_list.appendChild(mc_utils_getHelt("Nothing to show here,\n Start by adding some products."));
    }
}

var mcs_wvs_timeout;
function mc_search_tb_change() {
    if (mcs_wvs_timeout) clearTimeout(mcs_wvs_timeout);
    if (this.value.length > 2) {
        mcs_wvs_timeout = setTimeout(function () {
            mc_search_s();
        }, 500);
    }
}

function mc_search_s() {

    var products = pm_search(mc_search_tb.value);

    mc_search_list.innerHTML = "";
    for (var i = 0; i < products.length; i++) {
        var product_panel = mc_prt_ui_createProductPanel(products[i]);
        mc_search_list.appendChild(product_panel);
        product_panel.addEventListener("click", mc_prt_product_click);
    }
    prt_load_mins();
    if (products.length == 0) {
        mc_search_list.appendChild(mc_utils_getHelt("Nothing found!"));
    }

    //mc_search_sb.src = "images/toolbar_find.png";
}

function mc_search_tb_focusout() {
    Keyboard.hide();
}
var rec_pped = false;
function mc_search_sb_click() {
    if (!gl_rec_ava || rec_pped) return;
    rec_pped = true;
    mc_search_sb.src = "images/loading_rolling.gif";
    var options = {
        language: "en-US",
        matches: 1,
        prompt: "",      // Android only
        showPopup: true,  // Android only
        showPartial: true
    }

    window.plugins.speechRecognition.startListening(
        function (sval) {
            mc_search_tb.value = sval[0];
            mc_search_s()
            mc_search_sb.src = "images/microphone.png";
            rec_pped = false;
            //console.log(sval);
        }, function () {
            mc_search_sb.src = "images/microphone.png";
            rec_pped = false;
        }, options);
}