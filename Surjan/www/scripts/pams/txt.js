var langEN = {
    app_name: 'WalkOnRetail',
    company_ltd: 'A Devgaon Foods Pvt Ltd Division',
    invoice_upper: 'INVOICE',
    order_no: 'Order No',
    customer_name: 'Customer name',
    phone_no: 'Phone No',
    out_of_stock: 'Out of stock',
    add: 'Add',
    back: 'Back',
    next: 'Next',
    checkout: 'Checkout',
    del_addr: 'Delivery address',
    del_time: 'Delivery time',
    del_fees: 'Delivery fees',
    pay_method: 'Payment method',
    cod: 'Cash on delivery',
    product: 'Product',
    item: 'Item',
    price: 'Price',
    q: 'Q',
    total: 'Total',
    order_total: 'Order Total',
    saved_amount: 'Saved amount',
    addresses: 'Addresses',
    address: 'Address',
    add_new_address: 'Add new address',
    phone_number: 'Phone number',
    first_name: 'First name',
    last_name: 'Last name',
    email: 'Email',
    register: 'Register',
    login: 'Login',
    verify: 'Verify',
    already_registered: 'I have already registered',
    want_to_register: 'I want to register',
    otp_sent: 'We have sent you an SMS with verification code.',
    enter_code_below: 'Please enter code below',
    address_1: 'Address 1',
    address_2: 'Address 2',
    city: 'City',
    save: 'Save',
    pin_code: 'Pin Code',
    call: 'Call',
    order_on_phone: 'Order on phone',
    ok: 'Ok',
    cancel: 'Cancel',
    no: 'No',
    yes: 'Yes',
    close: 'Close',
    search: 'Search',
    logging_in: 'Logging in...',
    select_city: 'Select your city',
    select_region: 'Select your region',
    no_orders: 'You don\'t have any orders',
    phone_number: 'Phone number',
    email_address: 'Email address',
    nothing_to_show: 'There is nothing to show here!',
    company_info: 'Company info',
    order_phone: 'Order on Phone',

    nothing_found: 'Nothing found!',
    cart_is_empty: 'Your cart is empty!',

    no_notification: 'There are no new notification',
    for_return_visit_store: 'For return, please visit our store',
    thanks_for_shopping: 'Thank you for shopping',
    del_timings: 'Delivery Timings',
    change_phone_number: 'Change phone number',
    out_of_stock: 'Out of stock',
    could_not_connect_error: "We couldn't connect to our server,\nTap to retry",
    contact_ways_msg: 'You can contact us by calling or sending an email',
    order_on_phone_msg: 'You can order products by calling to this number',
    search_box_ph: 'Type here to search...',
    min_order_value: 'Minimum order value must be {%1} ₹ to place an order.',
    do_you_want_add_address: 'There is no address added yet, Do you want to add it now?',
    select_del_date_hour: 'Please select delivery date & hours',
    empty_cart_msg: 'Nothing to show here,\n Start by adding some products.',
    confirm_app_exit: 'Do you want to exit the app?',

    contact_us: 'Contact us',
    my_account: 'My account',
    search: 'Search',
    add_address: 'Add address',
    info: 'Info',
    notification: 'Notification',
    notifications: 'Notifications',
    promotions: 'Promotions',
    whatsapp: 'WhatsApp',
    my_orders: 'My Orders',
    home: 'Home',
    my_cart: 'My Cart',
    company_info: 'Company Info',
    share_the_app: 'Share the App',
    app_version: 'App Version',
    please_wait: 'Please wait...',

    login: 'Login',
    verify: 'Verify',
    register: 'Register',

    confirm_addr_delete: 'Are you sure you want to delete this address "{%1}" ?',
    invalid_phone_number: 'Please enter valid phone number in this format: 7007007000',
    phone_already_registrated: 'This phone number is already registered, Please login instead.',
    registration_error: 'We could not register you.',
    error_msg: 'We could not complete the current action, Please try again.',
    not_registrated: 'You are not registered yet, Please register first.',
    enter_valid_code: 'Please enter a valid 6 digits code.',
    wrong_auth_code: 'Verification code is incorrect.',
    login_success: 'You have been successfully logged in!',

};

function txt(textName) {
    if (langEN[textName]) {
        var text = langEN[textName];

        for (var i = 1; i < arguments.length; i++) {
            text = text.replace('{%' + i + '}', arguments[i]);
        }

        return text;

    } else return '';
}

function applyTextsToElements() {
    var elts = document.getElementsByTagName('*');
    var l = elts.length;
    for (var i = 0; i < l; i++) {
        var elt = elts[i];
        var tn = elt.getAttribute('txt');
        var ptn = elt.getAttribute('p-txt');
        if (tn) {
            elt.innerText = langEN[tn];
        }
        if (ptn) {
            elt.placeholder = langEN[ptn];
        }
    }
}