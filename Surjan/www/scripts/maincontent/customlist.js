var customlist;
var loadCustomlistAction;
function customlist_init() {

    customlist = {
        elt: get('mc_customlist'),
        list: get('custom_list'),

        isBusy: false,

        lockedBtn: null,
        lockedImg: null
    };

    registerPage('customlist', customlist.elt, txt('promotion'), customlist_update);
    loadCustomlistAction = fetchAction.create('cpl/custom', loadCustomlistActionCallback);
}

function customlist_update(param) {
    setDimmer(customlist.list, true);
    loadCustomlistAction.do({ids: param});
}

function loadCustomlistActionCallback(action) {
    var added = false;
    if (action.status == 'OK') {
        val(customlist.list, '');
        var products = action.data.items;
        pm_cache(products);
        for (var i = 0; i < products.length; i++) {
            added = true;
            var product_panel = mc_prt_ui_createProductPanel(products[i]);
            customlist.list.appendChild(product_panel);
            product_panel.addEventListener("click", mc_prt_product_click);
        }
        if (!added) {
            setPlaceHolderIcon('box', txt('nothing_to_show'), customlist.list);
        }
    } else {
        setNoNetPlaceHolder(customlist.list);
    }
}