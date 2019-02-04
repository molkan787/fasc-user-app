var razor_options;
var vpAction;
function payments_init() {
    log('TODO: Enable payment initialization');
    return;
    razor_options = {
        description: 'WalkOnRetail Order #',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_test_1u4sQ4Z38J9YoN',
        amount: '5000',
        name: 'WalkOnRetail',
        prefill: {
            email: '',
            contact: '',
            name: ''
        },
        theme: {
            color: '#F36F24'
        }
    }
    RazorpayCheckout.on('payment.success', razor_successCallback);
    RazorpayCheckout.on('payment.cancel', razor_cancelCallback);

    vpAction = fetchAction.create('cspv/razor', vpActionCallback);
}

var razor_successCallback = function (success) {
    log('payment_id: ' + success.razorpay_payment_id);
    var payment_id = success.razorpay_payment_id;
    var data = {
        payment_id: payment_id,
        order_id: recentOrderId
    };
    gl_show_wbp();
    vpAction.do(data);
}

var razor_cancelCallback = function (error) {
    msg(txt('payment_canceled'), null, 1);
    log(error.description + ' (Error ' + error.code + ')');
}

function open_pay(data) {
    razor_options.key = data.key;
    razor_options.description = 'WalkOnRetail Order #' + data.order_id;
    razor_options.amount = data.total * 100;
    razor_options.prefill.name = data.name;
    razor_options.prefill.contact = data.phone;
    razor_options.prefill.email = data.email;
    RazorpayCheckout.open(razor_options);
}

function reopen_pay() {
    RazorpayCheckout.open(razor_options);
}