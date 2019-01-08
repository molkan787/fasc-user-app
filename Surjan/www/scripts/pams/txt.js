var texts = {
    out_of_stock: 'Out of stock',
    add: 'Add'
};

function txt(name) {
    return (texts[name] ? texts[name] : '');
}