var dm_cats;
var dm_prt_categories = [];

var dm_company_info;
var dm_del_cost;
var dm_order_phone_num;

var dm_images_cache = [];
var dm_desc_cache = [];
var checkTime = 0;

var dm_cache = {};
var storage;

var forceCitySet = false;

var asdLoadAction;
var citiesLoadAction;

function dm_init() {
    storage = window.localStorage;
    
    var av = storage.getItem("version");
    dm.storeId = dm_get('store_id');

    asdLoadAction = fetchAction.create('asd', asdLoadActionCallback);
    citiesLoadAction = fetchAction.create('asd/sas', citiesLoadActionCallback);
    
}

function citiesLoadActionCallback(action) {
    if (action.status == 'OK') {
        sasLoaded(action.data);
    } else {
        ls_loading_failed();
    }
}

function asdLoadActionCallback(action) {
    if (action.status == 'OK') {
        dm.bsd = action.data.bsd;
        dm.city_names = action.data.city_names;
        lm_update_city();
        setAccountData(action.data.customer, action.data.addresses);
        dm.setStoreId(action.data.store_id);
        dm.setSessionId(action.data.session_id);
        dm_cats = action.data.cats;
        reset_banners();
        dm_add_banners(action.data.banners);
        gls.setData(action.data.gls);
        gls.setContactInfo(action.data.contact_info)
        mc_home_prt_load_categories();
        hide_loadScreen();
        if (action.data.new_update) {
            fascUpdate();
        }
    } else {
        ls_loading_failed();
    }
}

function dm_load(forceCityReload, logout) {
    if (forceCityReload) forceCitySet = true;
    if (dm.getStoreId() && !forceCityReload) {
        var params = { ls: fasc.lastUpdate };
        if (forceCitySet) params.ssi = 'true';
        if (logout) params.logout = 'true';

        asdLoadAction.do(params);
        forceCitySet = false;
    } else {
        citiesLoadAction.do();
    }
}

function new_ver_msg_answer(buttonIndex) {
    if (buttonIndex == 2) {
        cordova.InAppBrowser.open(app_play_url, '_system', 'location=yes');
    }
}

// --------------------------------

// Low level System

function dm_set(key, data) {
    storage.setItem(key, data);
}

function dm_append(key, value) {
    var dslt = storage.getItem(key);
    if (dslt) storage.setItem(key, dslt + value);
    else storage.setItem(key, value);
}

function dm_get(key) {
    return storage.getItem(key);
}

function dm_del(key) {
    storage.removeItem(key);
}