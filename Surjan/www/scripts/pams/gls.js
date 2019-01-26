var lang = 1;
var gls = {
    storeName: 'WalkOnRetail',
    storeAddr: '',

    orderPhone: '',
    contactPhone: '',
    contactEmail: '',

    setContactInfo: function (data) {
        this.storeName = data.name;
        this.storeAddr = data.address;
        this.contactPhone = data.phone;
        this.contactEmail = data.email;
        this.orderPhone = data.order_phone;
        window.localStorage.setItem('order_phone', this.orderPhone);
    },

    setData: function (data) {
        for (var gname in data) {
            if (data.hasOwnProperty(gname)) {
                this[gname] = data[gname];
                var gcontent = JSON.stringify(data[gname])
                window.localStorage.setItem(gname, gcontent);
            }
        }
    }
};