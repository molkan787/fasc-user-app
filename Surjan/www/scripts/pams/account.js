var client_id;
var client_token;
var client_num;
var client_first_name;
var client_last_name;

function acc_init() {
    client_num = storage.getItem("client_num");
    client_id = storage.getItem("client_id");
    client_token = storage.getItem("client_token");
    client_first_name = storage.getItem("client_first_name");
    client_last_name = storage.getItem("client_last_name");
}

function acc_set_num(num) {
    client_num = num;
    storage.setItem("client_num", num);
}

function acc_set_token(token, client) {
    client_token = token;
    client_id = client;
    storage.setItem("client_token", client_token);
    storage.setItem("client_id", client_id);
    acc_load_data();
}

function acc_load_data() {
    var post_url = get_gd_api_url(client_id, client_token);
    httpGetAsync(post_url, function (response) {
        if (response.substr(0, 5) != "ERROR") {
            var resp = JSON.parse(response);
            console.log(resp);
            storage.setItem("client_first_name", resp["first_name"]);
            storage.setItem("client_last_name", resp["last_name"]);
            storage.setItem("client_email", resp["email"]);
            client_first_name = resp["first_name"];
            client_last_name = resp["last_name"];
        }
    });
}