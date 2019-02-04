var slAction;

function social_login_init() {
    foreach(get_bc('fb_login'), function (item) {
        item.onclick = sl_open_fb;
    });

    slAction = fetchAction.create('csc/social_login', slActionCallback);
}

function slActionCallback(action) {
    if (action.status == 'OK') {
        setAccountData(action.data.data, action.data.addresses);
        msg(txt('login_success'), function () {
            reAsd();
            ui_navigate('home');
        }, 1);

    } else {
        //msg(action.raw_response, null, 1);
        msg(txt('error_msg'), null, 1);
    }
    gl_hide_wbp();
}

function sl_open_fb() {
    facebookConnectPlugin.login(['email', 'public_profile'], sl_fb_success, sl_fb_failure);
}

function sl_fb_success(data) {
    if (data.status == 'connected') {
        gl_show_wbp();
        var access_token = data.authResponse.accessToken;
        slAction.do({
            platform: 'fb',
            token: access_token
        });
        
    }
}

function sl_fb_failure() {
    //msg.show(txt(''));
}