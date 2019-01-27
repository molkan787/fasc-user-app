
var products = {};

function pm_cache(items) {
    for (var i = 0; i < items.length; i++) {
        products[items[i].product_id] = items[i];
    }
}

function pm_get_product(pid) {
    return products[pid];
}

// ====================================;

function pm_get_final_prize(pid) {
    var prt = products[pid];
    if (!prt) return 0;
    var price = parseFloat(prt.price);
    var discount = parseInt(prt.discount_amt);
    var dtype = parseInt(prt.discount_type);
    if (discount > 0) {
        if (dtype == 1) {
            return price - (price * discount / 100);
        } else {
            return price - discount;
        }
    } else {
        return price;
    }
}

function pm_imts(pid, count) {
    var prt = pm_get_product(pid);
    if (prt) {
        if (count+1 > prt.stock) {
            alert("You can't add more, because that's all what we have currently!");
            return true;
        } else return false;
    }
    return true;
}
