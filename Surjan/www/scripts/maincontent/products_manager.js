function pm_get_products(cat, subcat, offset, count) {
	var foundcount = 0;
	var result_list = [];

    for (var pid in dm_prt_products) {
        if (dm_prt_products.hasOwnProperty(pid)) {
            var product = dm_prt_products[pid];
            if (product.cat == cat && (product.subcat == subcat || subcat == "all")) {
                foundcount++;
                if (foundcount > offset) {
                    result_list.push(product);
                }
            }
            if (result_list.length >= count) break;
        }
    }

	return result_list;
}

function pm_get_product(pid) {
    return dm_prt_products[pid];
}

function pm_get_product_prize(pid) {
    var prt = dm_prt_products[pid];
    if (!prt) return 0;
    var discount = parseInt(prt.discount);
    var iscd = discount > 1000;
    if (iscd) discount -= 1000;
    var aprize = parseFloat(prt.prize);
    if (discount) {
        aprize = iscd ? aprize - discount : (aprize * (100 - discount) / 100);
    }
    return aprize;
}

function pm_get_product_min(pid) {
    var img_data = dm_get_product_min(pid);
    if (img_data) {
        return img_data;
    } else {
        return "images/document_image_cancel_32.png";
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

function pm_search(st) {
    st = st.toLowerCase();
    var r_fbyname = [];
    var r_fbycat = [];

    for (var pid in dm_prt_products) {
        if (dm_prt_products.hasOwnProperty(pid)) {
            var prt = dm_prt_products[pid];

            if (prt.display_name.toLowerCase().indexOf(st) !== -1) {
                r_fbyname.push(prt);
            } else if (prt.cat.toLowerCase().indexOf(st) !== -1) {
                r_fbycat.push(prt);
            }
        }
    }

    return r_fbyname.concat(r_fbycat);

}

// --------------------------------------

function mc_items_group_load(rawitems) {
    mc_items_group.innerHTML = "";
    var items = rawitems.split(",");
    for (var i = 0; i < items.length; i++) {
        var prt = pm_get_product(items[i]);
        if (prt) {
            var prt_pan = mc_prt_ui_createProductPanel(prt);
            mc_items_group.appendChild(prt_pan);
            prt_pan.addEventListener("click", mc_prt_product_click);
        }
    }
    prt_load_mins();
}

// --------------------------------------

function pm_update_products(items) {
    var old_ccount = cart_items_count;
    for (var i = 0; i < items.length; i++) {
        pm_update_product(items[i]);
        mc_prt_update_prt_pan(items[i]);
    }
    if (old_ccount > cart_items_count) {
        msg("One or more of items on your cart has been removed, Because is out of stock.\nDo you want to review your cart?", function () {
            ui_navigate("cart");
        });
    }
}

function pm_update_product(item) {
    var prt_raw_data = dm_crt_elt("prt_" + item.pid);
    if (prt_raw_data) {
        var prt_data = JSON.parse(prt_raw_data);
        prt_data.prize = item.prize;
        prt_data.discount = item.discount;
        prt_data.stock = item.stock;
        prt_raw_data = JSON.stringify(prt_data);
        dm_save("prt_" + item.pid, prt_raw_data);
        var prt = pm_get_product(item.pid);
        prt.prize = item.prize;
        prt.discount = item.discount;
        prt.stock = item.stock;
    }
}