var fasc;

function fasc_init() {
    fasc = {};
    fasc.ui = {
        formatPrice: function (price, includeSymbol) {
            if (typeof includeSymbol == 'undefined') includeSymbol = true;
            return parseFloat(price).toFixed(2) + (includeSymbol ? ' &#x20b9;' : '');
        }
    };
};