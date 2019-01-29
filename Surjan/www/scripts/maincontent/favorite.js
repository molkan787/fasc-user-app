var favorite;
var loadfavoriteAction;
var changeFavAction;
function favorite_init() {

    favorite = {
        elt: get('mc_favorite'),
        list: get('fav_list'),

        isBusy: false,

        lockedBtn: null,
        lockedImg: null
    };

    registerPage('favorite', favorite.elt, txt('my_favorite'), favorite_update);
    loadfavoriteAction = fetchAction.create('cpl/favorite', loadfavoriteActionCallback);
    changeFavAction = fetchAction.create('cpl/changeFavorite', changeFavActionCallback);
}

function favorite_update() {
    setDimmer(favorite.list, true);
    loadfavoriteAction.do();
}

function loadfavoriteActionCallback(action) {
    var added = false;
    if (action.status == 'OK') {
        val(favorite.list, '');
        var products = action.data.items;
        pm_cache(products);
        for (var i = 0; i < products.length; i++) {
            added = true;
            var product_panel = mc_prt_ui_createProductPanel(products[i]);
            favorite.list.appendChild(product_panel);
            product_panel.addEventListener("click", mc_prt_product_click);
        }
        if (!added) {
            setPlaceHolderIcon('box', txt('nothing_to_show'), favorite.list);
        }
    } else if (action.error_code == 'NO_CUSTOEMR'){
        setPlaceHolderIcon('box', txt('nothing_to_show'), favorite.list, true);
    } else {
        setNoNetPlaceHolder(favorite.list);
    }
}

function changeFavActionCallback(action) {
    var added = (action.data == 'added');
    if (action.status == 'OK') {
        var p = pm_get_product(action.params.pid);
        if (p) p.in_wishlist = added;
        favorite.lockedImg.src = 'images/icons/heart_' + (added ? 'filled' : 'outline') + '.png';
        attr(favorite.lockedBtn, 'state', added ? '1': '0')
    } else {
        var state = parseInt(attr(favorite.lockedBtn, 'state'));
        favorite.lockedImg.src = 'images/icons/heart_' + (state ? 'filled' : 'outline') + '.png';
    }
    favorite.isBusy = false;
}


function favBtnClick() {
    if (favorite.isBusy) return;
    favorite.isBusy = true;
    var pid = attr(this, 'pid');
    var state = parseInt(attr(this, 'state'));
    var op = state ? 'rm' : 'add';

    var imgElt = this.getElementsByTagName('img')[0];
    imgElt.src = 'images/loading.gif';

    favorite.lockedBtn = this;
    favorite.lockedImg = imgElt;

    changeFavAction.do({ op: op, pid: pid });
}