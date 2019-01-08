function mc_pages_set_content(p) {
    var content;
    mc_pages.style.textAlign = "left";
    if (p == "company_info") {
        content = dm_company_info;
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