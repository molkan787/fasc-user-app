var pp;
function pp_init() {

    pp = {
        isOpen: false,
        currentTarget: '',

        showAnim: {
            targets: '',
            top: '50%',
            opacity: 1,
            duration: 400,
            easing: 'easeOutExpo'
        },
        hideAnim: {
            targets: '',
            opacity: 0,
            duration: 300,
            easing: 'easeOutExpo',
            complete: function () {
                try {
                    get(pp.currentTarget).style.display = 'none';
                } catch (ex) {}
            }
        },

        show: function (elt_id) {
            this.isOpen = true;
            this.currentTarget = elt_id;
            this.showAnim.targets = '#' + elt_id;
            get(elt_id).style.display = 'block';
            anime(this.showAnim);
            show_bbp();
        },
        hide: function () {
            this.isOpen = false;
            this.hideAnim.targets = '#' + pp.currentTarget;
            anime(this.hideAnim);
            hide_bbp();
        }

    };

}

function show_bbp() {
    get('bbp_ll1').style.display = 'block';
    anime({
        targets: '#bbp_ll1',
        opacity: 0.5,
        duration: 400,
        easing: 'easeOutExpo'
    });
}
function hide_bbp() {
    anime({
        targets: '#bbp_ll1',
        opacity: 0,
        duration: 300,
        easing: 'easeOutExpo',
        complete: function () {
            get('bbp_ll1').style.display = 'none';
        }
    });
}