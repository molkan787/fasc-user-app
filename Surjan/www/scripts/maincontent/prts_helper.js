var acb;

function prtsHelper_init() {
    acb = {

        create: function (productId, initial_state, idPrefix) {
            var mpar = crt_elt('div');
            var spar1 = crt_elt('div', mpar);
            var spar2 = crt_elt('div', mpar);
            var spar3 = crt_elt('span', mpar);

            mpar.className = 'acb';
            spar1.className = 'acb_sp1';
            spar2.className = 'acb_sp2';
            spar3.className = 'acb_sp3';
            val(spar3, txt('out_of_stock'));

            var s1_img = crt_elt('img', spar1);
            var s1_span = crt_elt('span', spar1);

            val(s1_img, 'images/icons/cart_white.png');
            val(s1_span, txt('add'));

            var s2_img_minus = crt_elt('img', spar2);
            var s2_count = crt_elt('label', spar2);
            var s2_img_plus = crt_elt('img', spar2);


            return mpar;
        }

    };
}
