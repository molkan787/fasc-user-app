function mc_prt_cart_add() {
    var pid = this.getAttribute("pid");
    if (cart_ipq(pid, 1)) return;
    get("patc_count_" + pid).innerText = "1";
    this.style.display = "none";
    get("patc_con_" + pid).style.display = "block";
    cart_set_count(pid, 1);
}

function mc_prt_cart_plus() {
    var pid = this.getAttribute("pid");
    var elt_pcount = get("patc_count_" + pid);
    var pcount = parseInt(elt_pcount.innerText);
    pcount++;
    if (cart_ipq(pid, pcount)) return;
    elt_pcount.innerText = pcount;
    cart_set_count(pid, pcount);
}

function mc_prt_cart_minus() {
    var pid = this.getAttribute("pid");
    var elt_pcount = get("patc_count_" + pid);
    var pcount = elt_pcount.innerText;
    pcount--;
    elt_pcount.innerText = pcount;

    if (pcount <= 0) {
        get("patc_con_" + pid).style.display = "none";
        get("patc_add_" + pid).style.display = "inline-block";
    }
    cart_set_count(pid, pcount);

}

function _mc_prt_cart_add() {
    mc_prodp_crt_count.innerText = "1";
    mc_prodp_crt_add.style.display = "none";
    mc_prodp_crt_con.style.display = "block";
    cart_set_count(mc_prt_current, 1);
}

function _mc_prt_cart_plus() {
    var pcount = parseInt(mc_prodp_crt_count.innerText);
    if (cart_ipq(mc_prt_current, pcount)) return;
    pcount++;
    mc_prodp_crt_count.innerText = pcount;
    cart_set_count(mc_prt_current, pcount);
}

function _mc_prt_cart_minus() {
    var pcount = mc_prodp_crt_count.innerText;
    pcount--;
    mc_prodp_crt_count.innerText = pcount;

    if (pcount <= 0) {
        mc_prodp_crt_con.style.display = "none";
        mc_prodp_crt_add.style.display = "inline-block";
    }
    cart_set_count(mc_prt_current, pcount);

}


function cart_ipq(pid, count) {
    var prt = pm_get_product(pid);
    return (parseInt(count) > parseInt(prt.quantity));
}