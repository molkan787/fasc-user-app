var fasc;
function fasc_init() {
    fasc = {
        lang: 1,
        storeId: 0,

        lastUpdate: parseInt(window.localStorage.getItem('lastUpdate') || '0'),
        // Properties
        currencySymbol: '&#8377;',

        updateAction: null,

        // Methods
        formatPrice: function (price, without_sign) {
            return parseFloat(price).toFixed(2) + (without_sign ? '' : ' ' + this.currencySymbol);
        },

        setUpdateTime: function (time) {
            this.lastUpdate = time;
            window.localStorage.setItem('lastUpdate', time);
        },

        setLogo: function (data) {
            window.localStorage.setItem('logo_data', data);
        },

        update: function () {
            log('Fasc: Updating');
            this.updateAction.do();
        }
    };

    fasc.updateAction = fetchAction.create('asd/getlogo', updateActionCallback);

    get('ls_cities').onchange = select_city_changed;
    get('ls_regions').onchange = select_region_changed;
    get('ls_city_btn').onclick = city_btn_click;
}

function updateActionCallback(action) {
    if (action.status == 'OK') {
        fasc.setUpdateTime(action.data.time);
        fasc.setLogo(action.data.base64);
        log('Fasc: updated');
    } else {
        setTimeout(function () {
            fasc.update();
        }, 60000 * 5); // 5 Minutes
    }
}

function sasLoaded(data) {
    dm.stores = data.stores;
    dm.cities = data.cities;
    setOptions('ls_cities', data.cities, '---', 'name_' + dm.lang, 'city_id');
    switchElements('ls_loading_img', 'ls_select_city');
}

function select_city_changed() {
    var city_id = this.value;
    if (!city_id) {
        hideElt('ls_city_btn');
        hideElt('ls_select_region');
        return;
    }
    var regions = dm.getCity(city_id).childs;
    setOptions('ls_regions', regions.length > 0 ? regions : null, '---', 'name_' + dm.lang, 'city_id');
    if (regions.length > 0) {
        revealElt('ls_select_region');
        hideElt('ls_city_btn');
    } else {
        hideElt('ls_select_region');
        revealElt('ls_city_btn');
    }

}

function select_region_changed() {
    var region_id = this.value;
    if (!region_id) {
        hideElt('ls_city_btn');
    } else {
        revealElt('ls_city_btn');
    }
}

function city_btn_click() {
    var city_id = val('ls_cities');
    var region_id = val('ls_regions');
    var store = dm.getStore(city_id, region_id);
    if (store) {
        dm.setStoreId(store.store_id);
        switchElements('ls_select_city', 'ls_loading_img');
        dm_load();
    }
}

function reset_city_select() {
    hideElt('ls_city_btn');
    hideElt('ls_select_region');
}

function fascUpdate() {
    setTimeout(function () {
        fasc.update();
    }, 6000); // 5 Minutes
}