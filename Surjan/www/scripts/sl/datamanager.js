var dm;

function dm_init_v2() {
    dm_oca_init();
    dm.storeId = window.localStorage.getItem('storeId');
    dm.sessionId = window.localStorage.getItem('session_id') || '';
    dm.lang = 2;
    dm.apiToken = 'key';
    dm.callbacks = [];
    dm.bsd = {
        timing_from: "",
        timing_to: "",
        min_total: ""
    };

    dm.setSessionId = function(session_id) {
        this.sessionId = session_id;
        window.localStorage.setItem('session_id', session_id);
    };

    dm.registerCallback = function (callback) {
        this.callbacks.push(callback);
    };

    dm.callCallbacks = function () {
        for (var i = 0; i < this.callbacks.length; i++) {
            this.callbacks[i]();
        }
    };

    dm.getStoreId = function () {
        if (!this.storeId) this.storeId = window.localStorage.getItem('storeId');
        return this.storeId;
    };

    dm.setStoreId = function (storeId) {
        this.storeId = storeId;
        dm_set('storeId', storeId);
    };

    dm.getStore = function (city_id, region_id) {
        for (var i = 0; i < this.stores.length; i++) {
            if (this.stores[i].city_id == city_id) {
                if (region_id && this.stores[i].region_id == region_id) {
                    return this.stores[i];
                } else if (!region_id) {
                    return this.stores[i];
                }
            }
        }
    };

    dm.setAsd = function (data) {
        this.cats = data.categories.cats;
        this.subcats = data.categories.subcats;
        dm.callCallbacks();
    };

    dm.asdActionCallback = function (action) {
        if (action.status == 'OK') {
            dm.setAsd(action.data);
            if (dm.asdCallback) dm.asdCallback('OK');
        } else {
            dm.storeId = 0;
            if (dm.asdCallback) dm.asdCallback('FAIL');
            else msg.show('We could not load data.');
        }
    };

    dm.getCat = function (cat_id) {
        for (var i = 0; i < this.cats.length; i++) {
            var cat = this.cats[i];
            if (cat.id == cat_id) {
                cat.subs = this.subcats[cat_id];
                return cat;
            }
        }
    };

    dm.getCity = function (city_id) {
        for (var i = 0; i < this.cities.length; i++){
            if (this.cities[i].city_id == city_id) {
                return this.cities[i];
            }
        }
    };

    dm.reloadAsd = function (callback) {
        this.cats = {};
        this.subcats = {};
        dm.asdAction.do();
        dm.asdCallback = callback;
    };

    //dm.asdAction = fetchAction.create('common/asd', dm.asdActionCallback);
    //dm.asdAction.do();
}