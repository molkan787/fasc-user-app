var ws_lang;
var wsLoadAction;
var wsTexts;
var welcomeLoaded = false;
function ws_init() {
    get('ws_lang_btn1').onclick = ws_lang_btn_click;
    get('ws_lang_btn2').onclick = ws_lang_btn_click;
    get('ws_lang_okbtn').onclick = ws_lang_okbtn_click;

    wsLoadAction = fetchAction.create('asd/wel_txt', wsLoadActionCallback);
}

function wsLoadActionCallback(action) {
    if (action.status == 'OK') {
        welcomeLoaded = true;
        wsTexts = action.data.welcome_text;
        val('ls_wel_txt', wsTexts[1]);
        show_welcome_screen();
    } else {
        ls_loading_failed();
    }
}

function ws_lang_btn_click() {
    var langId = parseInt(attr(this, 'lid'));
    if (!ws_lang) {
        get('ws_lang_okbtn').style.display = 'inline-block';
        get('ws_lang_okbtn').style.opacity = 1;
    }
    val('ls_wel_txt', wsTexts[langId]);
    ws_lang = langId;
    if (langId == 1) {
        get('ws_lang_btn1').className = 'active';
        get('ws_lang_btn2').className = '';
    } else {
        get('ws_lang_btn1').className = '';
        get('ws_lang_btn2').className = 'active';
    }
}

function ws_lang_okbtn_click() {
    window.localStorage.setItem('launched', 'true');
    setLang(ws_lang);
    hide_welcome_screen();
    dm_load();
}

function show_welcome_screen() {
    get("welcome_screen").style.display = "block";
    anime({
        targets: "#welcome_screen",
        opacity: 1,
        top: '0vw',
        duration: 600,
        easing: 'easeOutExpo'
    });
}

function hide_welcome_screen() {
    anime({
        targets: "#welcome_screen",
        opacity: 0,
        top: '-10vw',
        duration: 600,
        easing: 'easeOutExpo',
        complete: function () {
            get("welcome_screen").style.display = "none";
        }
    });
}