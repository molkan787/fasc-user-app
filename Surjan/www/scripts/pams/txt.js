﻿var langEN = {
    app_name: 'WalkOnRetail',
    promotion: 'Promotion',
    invoice_upper: 'INVOICE',
    order_no: 'Order No',
    customer_name: 'Customer name',
    phone_no: 'Phone No',
    out_of_stock: 'Out of stock',
    add: 'Add',
    back: 'Back',
    next: 'Next',
    share_product: 'Share Product',
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
    select_city: 'Choose your city',
    select_region: 'Choose your region',
    no_orders: 'You don\'t have any orders',
    phone_number: 'Phone number',
    email_address: 'Email address',
    nothing_to_show: 'There is nothing to show here!',
    company_info: 'Company info',
    order_phone: 'Order on Phone',
    continue_shopping: 'Continue Shopping',

    nothing_found: 'Nothing found!',
    cart_is_empty: 'Your cart is empty!',
    download_invoice: 'Download invoice',
    cancel_order: 'Cancel order',
    order_on_whatsapp_text: 'You can order on WhatsApp',
    order_on_whatsapp: 'Order on WhatsApp',
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
    select_del_date_hour: 'Please select delivery date & time',
    empty_cart_msg: 'Nothing to show here,\n Start by adding some products.',
    confirm_app_exit: 'Do you want to exit the app?',
    payment_canceled: 'You have canceled the payment!',
    no_permission_msg: 'We cannot provide Voice Search without this permission',
    add_addr_msg: 'Please Register or Login before adding address',

    remove: 'Remove',
    clear_cart: 'Clear Cart',
    regular_del_phrase: 'Regular Delivery ({%1} – {%2})',
    fast_del_phrase: 'Fast Delivery ({%1})',
    minutes: 'Minutes',
    free: 'Free',
    cost: 'Cost',
    delivery_date: 'Delivery date',
    delivery_timing: 'Delivery timing',
    delivery_address: 'Delivery address',
    order_items: 'Order items:',
    order_total: 'Order total',
    status_1: 'Pending',
    status_5: 'Completed',
    status_7: 'Canceled',
    order_date: 'Order date',
    order: 'Order',
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
    change_city: 'Change city',
    logout: 'Logout',
    no_net_error: 'We could not connect to the internet',
    my_favorite: 'My Favorite',
    confirm_addr_delete: 'Are you sure you want to delete this address "{%1}" ?',
    invalid_phone_number: 'Please enter valid phone number in this format: 7007007000',
    phone_already_registrated: 'This phone number is already registered, Please login instead.',
    registration_error: 'We could not register you.',
    error_msg: 'We could not complete the current action, Please try again.',
    not_registrated: 'You are not registered yet, Please register first.',
    enter_valid_code: 'Please enter a valid 6 digits code.',
    wrong_auth_code: 'Verification code is incorrect.',
    login_success: 'You have been successfully logged in! The app will reload now.',
    load_addrs_fail: 'We could not load list of your addresses',
    order_success: 'Your order was successfully placed!',
    payment_success: 'Your payment was successfully received!',
    payment_redirection: 'Your order was successfully placed! You will be redirected now to payment page',
    confirm_logout: 'Are you sure you want to logout?',
    confirm_order_cancel: 'Are you sure you want to cancel this order?',
    cancel_order_too_late: 'Sorry but it is too late to cancel the order.',
    cancel_order_success: 'Your Order was successfully canceled.',
    choose_language: 'Choose your language',
    shop_by_categories: 'Shop by Categories',
    shop_by_brands: 'Shop by Brands',
    order_by_price: 'Order by Price',
    high_to_low: 'High to Low',
    low_to_high: 'Low to High',
    credit_card_net_banking: 'Credit Card/Net Banking'
};

function txt(textName) {
    var text = langEN[textName];
    if (text) {
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

function setLang(langId, doNotWrite) {
    lang = langId;
    dm.lang = langId;
    window.localStorage.setItem('lang', langId);
}