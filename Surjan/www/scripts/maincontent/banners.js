var loadAdsAction;
var home_ads;
function mc_banners_init() {
    home_ads = get('home_ads');
    loadAdsAction = fetchAction.create('promos/list', loadAdsActionCallback);
}

function loadAds() {
    val(home_ads, '');
    loadAdsAction.do();
}

function loadAdsItems(items) {
    for (var i = 0; i < items.length; i++) {
        createAdPanel(items[i]);
    }
}

function createAdPanel(data) {
    var img = crt_elt('img');
    img.className = 'promo_item promo_format' + data.format;
    val(img, data.image);

    attr(img, 'data-items', data.link);
    img.onclick = banner_click;

    home_ads.appendChild(img);
}

function loadAdsActionCallback(action) {
    if (action.status == 'OK') {
        loadAdsItems(action.data.items);
    } else {
        retryAdsLoading();
    }
}

var adsLoadRetryDelay = 10000;
function retryAdsLoading() {
    setTimeout(function () {
        loadAdsAction.do();
    }, adsLoadRetryDelay);

    adsLoadRetryDelay *= 2;
}


function banner_click() {
    var items = attr(this, 'data-items');
    if (items && items.length > 0) {
        ui_navigate('customlist', items);
    }
}