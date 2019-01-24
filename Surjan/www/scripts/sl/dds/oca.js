
function dm_oca_init() {
    dm = {
        // Properties
        apiBaseURL: 'http://fasc.local/index.php?session={%4}&lang={%3}&store_id={%1}&api_token={%2}&route=api/',
        //apiBaseURL: 'https://www.walkonretail.com/index.php?lang={%3}store_id={%1}&api_token={%2}&route=api/',

        // Methods
        _getApiUrl: function (req, params) {
            var url = this.apiBaseURL.replace('{%1}', this.storeId).replace('{%2}', this.apiToken);
            url = url.replace('{%3}', this.lang).replace('{%4}', dm.sessionId);
            url += req;

            if (params && typeof params == 'object') {
                if (typeof params.push == 'function') {
                    for (var i = 0; i < params.length; i++) {
                        url += '&' + params[i].name + '=' + encodeURIComponent(params[i].value);
                    }
                } else {
                    for (var name in params) {
                        if (params.hasOwnProperty(name)) {
                            url += '&' + name + '=' + encodeURIComponent(params[name]);
                        }
                    }
                }
            }

            return url;
        },
        _callApi: function (url, action, dataProperty) {
            httpGetAsync(url, function (resp) {
                try {
                    resp = JSON.parse(resp);
                } catch (ex) {
                    //log(resp);
                    action.release('FAIL', 'invalid_json');
                    return;
                }
                if (resp.status == 'OK') {
                    if (typeof dataProperty != 'undefined') {
                        action.data = resp.data[dataProperty];
                    } else {
                        action.data = resp.data;
                    }
                    action.release('OK');
                } else {
                    action.release('FAIL', resp.error_code);
                }
            }, function () {
                action.release('FAIL', 'network_error');
            });
        },

    };
}