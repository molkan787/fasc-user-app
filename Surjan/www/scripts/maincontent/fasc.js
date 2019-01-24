var fasc;
function fasc_init() {
    fasc = {
        lang: 1,
        storeId: 0,
        // Properties
        currencySymbol: '&#8377;',

        // Methods
        formatPrice: function (price, without_sign) {
            return parseFloat(price).toFixed(2) + (without_sign ? '' : ' ' + this.currencySymbol);
        }
    };

    get('ls_cities').onchange = select_city_changed;
    get('ls_regions').onchange = select_region_changed;
    get('ls_city_btn').onclick = city_btn_click;
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