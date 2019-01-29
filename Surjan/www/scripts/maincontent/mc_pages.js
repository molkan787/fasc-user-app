function mc_pages_init() {

}

function mc_pages_set_content(p) {
    var content;
    mc_pages.style.textAlign = "left";
    if (p == "company_info") {
        content = gls.company_info[lang];
    }
    mc_pages.innerHTML = content;
    var links = mc_pages.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", mc_p_catch_click);
    }
}

function mc_p_catch_click(e) {
    e.preventDefault();
    cordova.InAppBrowser.open(this.getAttribute("href"), '_blank', 'location=yes');
}

function update_contact_page() {
    var phone = get('contact_phone');
    var email = get('contact_email');
    phone.href = 'tel:' + gls.contactPhone;
    email.href = 'mailto:' + gls.contactEmail;
    val(phone, txt('phone_number') + '<br/>' + gls.contactPhone);
    val(email, txt('email_address') + '<br/>' + gls.contactEmail);
    val('contact_store', '(' + gls.storeName + ')');
    val('contact_addr', gls.storeAddr);
}