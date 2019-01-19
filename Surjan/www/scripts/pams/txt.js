var langEN = {
    out_of_stock: 'Out of stock',
    add: 'Add',
    back: 'Back',
    next: 'Next',
    checkout: 'Checkout',
    del_addr: 'Delivery address',
    del_time: 'Delivery time',
    del_fees: 'Delivery fees',
    pay_method: 'Payment method',
    cod: 'Cash on delivery',
    item: 'Item',
    price: 'Price',
    q: 'Q',
    total: 'Total',
    addresses: 'Addresses',
    add_new_address: 'Add new address',
    phone_number: 'Phone number',
    first_name: 'First name',
    last_name: 'Last name',
    register: 'Register',
    already_registered: 'I have already registered',

    search_box_ph: 'Type here to search...'
};

function txt(textName) {
    if (langEN[textName]) {
        var text = langEN[textName];

        for (var i = 1; i < arguments.length; i++) {
            text = text.replace('{%' + i + '}', arguments[i]);
        }

        return text;

    } else return '';
}

function applyTextsToElements() {
    var elts = document.getElementsByTagName('*');
    var l = elts.length;
    for (var i = 0; i < l; i++) {
        var elt = elts[i];
        var tn = elt.getAttribute('txt');
        var ptn = elt.getAttribute('p-txt');
        if (tn) {
            elt.innerText = langEN[tn];
        }
        if (ptn) {
            elt.placeholder = langEN[ptn];
        }
    }
}