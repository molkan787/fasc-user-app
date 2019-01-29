var mc_search;
var mc_search_list;
var mc_search_tb;
var mc_search_sb;

var searchAction;

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

    registerPage('search', mc_search, txt('search'), function () {
        showSearchBar();
    });

    get('hb_search_back').onclick = ui_goback;
    
    searchAction = fetchAction.create('product/list&side=client', searchActionCallback);
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

function searchActionCallback(action) {
    if (action.status == 'OK' && action.params.sid == last_search_id) {
        var products = action.data.items;
        pm_cache(products);
        mc_search_list.innerHTML = "";
        for (var i = 0; i < products.length; i++) {
            var product_panel = mc_prt_ui_createProductPanel(products[i]);
            mc_search_list.appendChild(product_panel);
            product_panel.addEventListener("click", mc_prt_product_click);
        }

        if (products.length == 0) {
            setPlaceHolderIcon('search', txt('nothing_found'), mc_search_list);
        }
    } else {
        setNoNetPlaceHolder(mc_search_list);
    }
}
var search_id_ptr = 1;
var last_search_id = 0;
function mc_search_s() {
    search_id_ptr++;
    last_search_id = search_id_ptr;
    setDimmer(mc_search_list, true);
    searchAction.do({ name: mc_search_tb.value, start: 0, limit: 20, sid: search_id_ptr});

}

function mc_search_tb_focusout() {
    try {
        Keyboard.hide();
    } catch (ex) {

    }
}
var rec_pped = false;
function mc_search_sb_click() {
    if (!gl_rec_ava || rec_pped) return;
    rec_pped = true;
    mc_search_sb.src = "images/loading_rolling.gif";
    var options = {
        language: "en-US",
        matches: 1,
        prompt: "",
        showPopup: true,
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

var searchbar_anim = {
    targets: '#hb_search',
    top: 0,
    opacity: 1,
    easing: 'easeOutExpo',
    duration: 300
};

function showSearchBar() {
    searchbar_anim.top = 0;
    searchbar_anim.opacity = 1;
    searchbar_anim.duration = 300;
    anime(searchbar_anim);
}

function hideSearchBar() {
    mc_search_tb.value = '';
    searchbar_anim.top = '-50px';
    searchbar_anim.opacity = 0;
    searchbar_anim.duration = 700;
    anime(searchbar_anim);
}