var razor_options = {
    description: 'Credits towards consultation',
    image: 'https://i.imgur.com/3g7nmJC.png',
    currency: 'INR',
    key: 'rzp_test_1DP5mmOlF5G5ag',
    order_id: 'order_7HtFNLS98dSj8x',
    amount: '5000',
    name: 'WalkOnRetail',
    prefill: {
        email: 'pranav@razorpay.com',
        contact: '8879524924',
        name: 'Pranav Gupta'
    },
    theme: {
        color: '#F36F24'
    }
}

var successCallback = function (success) {
    alert('payment_id: ' + success.razorpay_payment_id)
    var orderId = success.razorpay_order_id
    var signature = success.razorpay_signature
}

var cancelCallback = function (error) {
    log(error.description + ' (Error ' + error.code + ')');
}

function payments_init() {
    RazorpayCheckout.on('payment.success', successCallback);
    RazorpayCheckout.on('payment.cancel', cancelCallback);
}

function open_pay(data) {
    razor_options.amount = data.amount;
    razor_options.prefill.name = data.name;
    razor_options.prefill.contact = data.phone;
    razor_options.prefill.email = data.email;
    RazorpayCheckout.open(razor_options);
}

setTimeout(function () {
    alert('Opening Razorpay');
    RazorpayCheckout.open(razor_options);
}, 10000);